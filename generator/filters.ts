import type { NodeFactory } from "typescript";
import ts from "typescript";
import { createNamespace, createStringUnion } from "./factories.js";
import { printNodesToFile } from "./printer.js";
import { getDocument, normalizeFilterName } from "./utils.js";

/**
 * @see https://api.stackexchange.com/docs/filters
 * @summary generates a list of built-in filters
 * @param factory compiler factory to use
 * @param base API base URL to use
 * @param path API endpoint path
 * @param filePath output file path
 * @param namespaceName namespace name
 */
export const generateBuiltInFilters = async (
    factory: NodeFactory,
    base: string,
    path: string,
    filePath: string,
    namespaceName: string
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

    const filtersEnum = createStringUnion(factory, "BuiltIn", filters, {
        exported: true,
    });

    const namespace = createNamespace(factory, namespaceName, [filtersEnum], {
        exported: true,
    });

    return printNodesToFile(ts, [namespace], filePath);
};
