import type { NodeFactory, StringLiteral } from "typescript";
import ts from "typescript";
import { createEnum } from "./factories.js";
import { printNodesToFile } from "./printer.js";
import { getDocument, normalizeFilterName } from "./utils.js";

/**
 * @see https://api.stackexchange.com/docs/filters
 * @summary generates a list of built-in filters
 * @param factory compiler factory to use
 * @param base API base URL to use
 * @param path API endpoint path
 * @param filePath output file path
 */
export const generateBuiltInFilters = async (
    factory: NodeFactory,
    base: string,
    path: string,
    filePath: string
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

    const filterElems = listElem.querySelectorAll("ul li code");

    const filters: Map<string, StringLiteral> = new Map();
    filterElems.forEach(({ textContent }) => {
        if (!textContent || /^\*?\./.test(textContent)) return;

        const memberName = normalizeFilterName(textContent);
        const memberValue = factory.createStringLiteral(
            memberName.toLowerCase()
        );

        filters.set(memberName, memberValue);
    });

    const filtersEnum = createEnum(factory, "BuiltInFilters", filters, {
        exported: true,
    });

    return printNodesToFile(ts, [filtersEnum], filePath);
};
