import got from "got";
import { JSDOM } from "jsdom";

export const text = ({ childNodes }: Element) =>
    [...childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join("")
        .trim();

export const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1e3));

export const partition = <T extends any[]>(arr: T, parts: number) => {
    const perPart = Math.ceil(arr.length / parts);

    const partitions: T[] = [];
    for (let i = 0; i < parts; i++) {
        const start = i * perPart;
        partitions.push(arr.slice(start, start + perPart) as T);
    }

    return partitions;
};

export const capitalize = (txt: string) =>
    txt[0].toUpperCase() + txt.slice(1).toLowerCase();

/**
 * @summary properly capitalizes the type name and joins words on underscore or space
 * @param name non-normalized type name (i.e. just parsed from docs)
 */
export const normalizeTypeName = (name: string) =>
    name.split(/[_ ]/).map(capitalize).join("");

/**
 * @summary capitalizes the filter name, as well as trims, and removes leading and trailing dots
 * @param name non-normalized type name (i.e. just parsed from docs)
 */
export const normalizeFilterName = (name: string) => {
    return name
        .trim()
        .replace(/^[.]|[.]$/g, "")
        .toLowerCase();
};

export type GetDocumentOptions = {
    hash?: string;
    parameters?: Record<string, string>;
};

/**
 * @summary fetches a JSDOM document from a URL
 */
export const getDocument = async (
    base: string,
    path: string,
    { hash, parameters = {} }: GetDocumentOptions = {}
) => {
    const url = new URL(`${base}${path}`);
    url.search = new URLSearchParams(parameters).toString();
    if (hash) url.hash = hash;

    const res = await got(url);
    if (res.statusCode !== 200) return;

    const { body } = res;

    const {
        window: { document },
    } = new JSDOM(body);

    return document;
};
