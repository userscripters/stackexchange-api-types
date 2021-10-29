import got from "got";
import type ts from "typescript";
import { __String } from "typescript";
import { URL } from "url";
import { InterfaceOptions, parseInterface } from "./parsers.js";
import { printNodesToFile } from "./printer.js";
import { getDocument, partition, sleep } from "./utils.js";
import { generateResponseWrapper } from "./wrapper.js";

const DOCS_BASE = "https://api.stackexchange.com";
const TYPES_PATH = "./lib";

const { version, name, description } = await import("../package.json");

got.extend({
    responseType: "text",
    headers: {
        "User-Agent": `name ${name}; version ${version}; about ${description};`,
    },
});

const docsHome = new URL(`${DOCS_BASE}/docs`);
docsHome.searchParams.append("tab", "type");
docsHome.hash = "docs";

const res = await got(docsHome);

if (res.statusCode === 200) {
    const { body } = res;

    const { JSDOM } = await import("jsdom");

    const {
        window: { document },
    } = new JSDOM(body);

    const indented = [...document.querySelectorAll(".indented")];

    const typeWrapSel = ".method";
    const typeLinkSel = "p > a[href*='/docs/types']";
    const typeReqSel = ".method-name > .excluded";
    const typeNameSel = ".mainbar > .subheader h1";
    const typeFieldsSel = ".indented > .method";

    const typeWrappers = indented.filter(
        (e) => !!e.querySelectorAll(typeWrapSel).length
    );

    const typePaths = typeWrappers
        .map((e) => e.querySelector<HTMLAnchorElement>(typeLinkSel)?.href || "")
        .filter(Boolean);

    // some types are not linked to from the main page
    typePaths.push(
        ...[
            "shallow-user",
            "collective-external-link",
            "collective-recommendation",
            "badge-count",
            "network-post",
            "closed-details",
            "original-question",
            "migration-info",
            "notice",
            "related-site",
            "styling",
            "collective-membership",
        ].map((p) => `/docs/types/${p}`)
    );

    const partitions = partition(typePaths, 3);

    const { default: ts } = await import("typescript");
    const { factory } = ts;

    const nsName = "StackExchangeAPI";

    const nodes: Map<__String, ts.Node> = new Map();

    const unionRegex =
        /(?:(?:an )?array of )?(?:one of )?'?(\w+)'?(?:,? (?:or )?(?:but new options (?:can|may|might) be added\.)?|$)/i;

    const interfaceOptions: InterfaceOptions = {
        exported: true,
        overrides: {
            event_id: factory.createKeywordTypeNode(
                ts.SyntaxKind.NumberKeyword
            ),
        },
    };

    for (const partition of partitions) {
        for (const path of partition) {
            const document = await getDocument(DOCS_BASE, path);
            if (!document) continue;

            const iface = parseInterface(
                factory,
                document,
                typeNameSel,
                typeFieldsSel,
                typeReqSel,
                unionRegex,
                interfaceOptions
            );

            const { escapedText } = iface.name;

            nodes.has(escapedText) || nodes.set(escapedText, iface);
        }

        await sleep(1);
    }

    const unique: ts.Node[] = [];
    for (const [, node] of nodes) {
        unique.push(node, factory.createIdentifier("\n"));
    }

    unique.push(factory.createNamespaceExportDeclaration(nsName));

    await printNodesToFile(ts, unique, `${TYPES_PATH}/types.d.ts`);

    await generateResponseWrapper(
        factory,
        DOCS_BASE,
        "/docs/wrapper",
        `${TYPES_PATH}/wrapper.d.ts`,
        typeNameSel,
        typeFieldsSel,
        typeReqSel,
        unionRegex,
        "Wrappers"
    );
}
