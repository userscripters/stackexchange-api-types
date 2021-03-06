import type { NodeFactory } from "typescript";
import ts from "typescript";
import {
    createModuleDeclaration,
    createNamespace,
    createUnionOfPrimitives,
} from "./factories.js";
import { printNodesToFile } from "./printer.js";
import { getDocument, normalizeFilterName } from "./utils.js";

/**
 * @summary adds a global-modifying version of the module
 * @param factory compiler factory to use
 * @param namespaceName namespace name
 * @param globalNsName namespace name added to the UMD module
 * @param filters array of filter names
 */
const addGlobalModifyingVersion = (
    factory: NodeFactory,
    namespaceName: string,
    globalNsName: string,
    filters: string[]
) => {
    const union = createUnionOfPrimitives(factory, "BuiltIn", filters);
    const ns = createNamespace(factory, namespaceName, [union]);
    const commonNS = createNamespace(factory, globalNsName, [ns]);
    return createModuleDeclaration(factory, "global", [commonNS], {
        isAmbient: true,
        isGlobal: true,
    });
};

/**
 * @see https://api.stackexchange.com/docs/filters
 * @summary generates a list of built-in filters
 * @param factory compiler factory to use
 * @param base API base URL to use
 * @param path API endpoint path
 * @param filePath output file path
 * @param namespaceName namespace name
 * @param globalNsName namespace name added to the UMD module
 */
export const generateBuiltInFilters = async (
    factory: NodeFactory,
    base: string,
    path: string,
    filePath: string,
    namespaceName: string,
    globalNsName: string
) => {
    const document = await getDocument(base, path);
    if (!document) return;

    const headerElems = [...document.querySelectorAll(".mainbar h2")];

    const { nextElementSibling: listElem } =
        headerElems.find(
            ({ textContent }) =>
                textContent && /built[- ]in filters/i.test(textContent)
        ) || {};
    if (!listElem) return;

    const filterElems = [...listElem.querySelectorAll("ul li code")];

    const filters = filterElems
        .filter(({ textContent }) => textContent && !/^\*?\./.test(textContent))
        .map(({ textContent }) => normalizeFilterName(textContent!));

    const union = createUnionOfPrimitives(factory, "BuiltIn", filters, {
        exported: true,
    });

    const ns = createNamespace(factory, namespaceName, [union], {
        exported: true,
    });

    const global = addGlobalModifyingVersion(
        factory,
        namespaceName,
        globalNsName,
        filters
    );

    return printNodesToFile(
        ts,
        [ns, factory.createIdentifier("\n"), global],
        filePath
    );
};
