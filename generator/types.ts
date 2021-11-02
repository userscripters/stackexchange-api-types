import type { NodeFactory, __String } from "typescript";
import ts from "typescript";
import { createModuleDeclaration, createNamespace } from "./factories.js";
import { InterfaceOptions, parseInterface } from "./parsers.js";
import { printNodesToFile } from "./printer.js";
import { getDocument, interleave, partition, sleep } from "./utils.js";

const addGlobalModifyingVersion = (
    factory: NodeFactory,
    namespaceName: string,
    statements: ts.DeclarationStatement[]
) => {
    const ns = createNamespace(factory, namespaceName, statements);
    return createModuleDeclaration(factory, "global", [ns], {
        isAmbient: true,
        isGlobal: true,
    });
};

export const generateTypes = async (
    factory: NodeFactory,
    base: string,
    filePath: string,
    namespaceName: string
) => {
    const document = await getDocument(base, "/docs", {
        hash: "docs",
        parameters: { tab: "type" },
    });
    if (!document) return;

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

    const nodeMap: Map<__String, ts.DeclarationStatement> = new Map();

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
            const document = await getDocument(base, path);
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

            nodeMap.has(escapedText) || nodeMap.set(escapedText, iface);
        }

        await sleep(1);
    }

    const nodes = [...nodeMap.values()];

    const pretty = interleave(nodes, factory.createIdentifier("\n"));

    const global = addGlobalModifyingVersion(factory, namespaceName, nodes);

    await printNodesToFile(
        ts,
        [...pretty, factory.createIdentifier("\n"), global],
        filePath
    );
};
