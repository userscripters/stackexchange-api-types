import type { KeywordTypeSyntaxKind, Modifier, NodeFactory } from "typescript";
import ts from "typescript";
import { createProperty } from "./factories.js";
import { normalizeTypeName, text } from "./utils.js";

export const API_TYPES: Record<string, KeywordTypeSyntaxKind> = {
    boolean: ts.SyntaxKind.BooleanKeyword,
    string: ts.SyntaxKind.StringKeyword,
    integer: ts.SyntaxKind.NumberKeyword,
    decimal: ts.SyntaxKind.NumberKeyword,
    date: ts.SyntaxKind.NumberKeyword,
};

/**
 * @summary parses type description into UnionTypeNode
 * @param {NodeFactory} f compiler factory to use
 * @param {string} desc type description
 * @param {RegExp} regex regular expression to split union members
 */
export const parseUnion = (f: NodeFactory, desc: string, regex: RegExp) => {
    const members = desc.split(regex).filter(Boolean);
    return f.createUnionTypeNode(
        members.map((type) =>
            f.createLiteralTypeNode(f.createStringLiteral(type))
        )
    );
};

/**
 * @summary parses type description into KeywordTypeNode
 * @param {NodeFactory} f compiler factory to use
 * @param {string} key normalized keyword description
 */
export const parseKeyword = (f: NodeFactory, key: string) => {
    const kind = API_TYPES[key];
    return kind || key.includes(" ")
        ? f.createKeywordTypeNode(kind || ts.SyntaxKind.UnknownKeyword)
        : f.createTypeReferenceNode(normalizeTypeName(key));
};

/**
 * @summary parses type members into array of PropertySignature
 * @param {NodeFactory} f compiler factory to use
 * @param {Element[]} fields type description fields
 * @param {string} modifierSelector selector for matching optionality modifier
 * @param {RegExp} unionRegex regular expression to split union members
 */
export const parseFields = (
    f: NodeFactory,
    fields: Element[],
    modifierSelector: string,
    unionRegex: RegExp
) => {
    return fields.map((field) => {
        const optional = !!field.querySelector(modifierSelector);
        const name = text(field.querySelector(".method-name")!);
        const [desc] = (
            field.querySelector(".method-description")!.textContent || ""
        )
            .trim()
            .split("\n");

        const [type] = desc.split(/,/);
        const [, item] = /array of (.+)s/i.exec(desc) || [];

        const key = item || type;

        const keyword = desc.includes(" or ")
            ? parseUnion(f, desc, unionRegex)
            : parseKeyword(f, key);

        const node = item ? f.createArrayTypeNode(keyword) : keyword;

        return createProperty(f, name, node, optional);
    });
};

export type InterfaceOptions = {
    exported?: boolean;
    overrides?: Record<string, KeywordTypeSyntaxKind>;
};

/**
 * @summary parses type description into InterfaceDeclaration
 * @param {NodeFactory} f compiler factory to use
 * @param {Document} document document element to parse from
 * @param {string} nameSelector interface identifier selector
 * @param {string} modifierSelector selector for matching optionality modifier
 * @param {RegExp} unionRegex regular expression to split union members
 */
export const parseInterface = (
    f: NodeFactory,
    document: Document,
    nameSelector: string,
    modifierSelector: string,
    unionRegex: RegExp,
    { exported = false, overrides = {} }: InterfaceOptions = {}
) => {
    const { textContent } = document.querySelector(nameSelector) || {};
    const name = normalizeTypeName(textContent?.replace(/type\s+/i, "") || "");

    const typeFields = [...document.querySelectorAll(".indented > .method")];
    const fields = parseFields(f, typeFields, modifierSelector, unionRegex);

    const overridden = fields.map((field) => {
        const { name } = field;

        const fieldName = ts.isIdentifier(name)
            ? name.escapedText.toString()
            : "";

        const override = overrides[fieldName];
        return override
            ? createProperty(f, fieldName, f.createKeywordTypeNode(override))
            : field;
    });

    const modifiers: Modifier[] = [];
    if (exported) modifiers.push(f.createModifier(ts.SyntaxKind.ExportKeyword));

    return f.createInterfaceDeclaration(
        undefined,
        modifiers,
        name,
        undefined,
        undefined,
        overridden
    );
};
