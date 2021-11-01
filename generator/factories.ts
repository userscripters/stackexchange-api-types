import type {
    EnumMember,
    Expression,
    Identifier,
    KeywordTypeSyntaxKind,
    Modifier,
    NodeFactory,
    Statement,
    TypeNode,
} from "typescript";
import ts from "typescript";
import { parseKeyword } from "./parsers.js";

/**
 * @summary creates a PropertySignature
 * @param {NodeFactory} f compiler factory to use
 * @param {string} name property name
 * @param {TypeNode} node signature content
 * @param {boolean} [optional] whether the property is optional
 */
export const createProperty = (
    f: NodeFactory,
    name: string,
    node: TypeNode,
    optional = false
) =>
    f.createPropertySignature(
        undefined,
        f.createIdentifier(name),
        optional ? f.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        node
    );

export type TypeParameterOptions = {
    constraint?: KeywordTypeSyntaxKind;
    defaults?: KeywordTypeSyntaxKind;
};

/**
 * @summary creates a type parameter for use with generics
 * @param f compiler factory to use
 * @param name property name
 * @param options configuration
 */
export const createTypeParameter = (
    f: NodeFactory,
    name: string | Identifier,
    { constraint, defaults }: TypeParameterOptions
): ts.TypeParameterDeclaration => {
    return f.createTypeParameterDeclaration(
        typeof name === "string" ? f.createIdentifier(name) : name,
        constraint && f.createKeywordTypeNode(constraint),
        defaults && f.createKeywordTypeNode(defaults)
    );
};

/**
 * @summary creates an array of keword type nodes
 * @param f compiler factory to use
 * @param name identifier name for array values
 */
export const createKeywordArray = (f: NodeFactory, name: string) => {
    return f.createArrayTypeNode(parseKeyword(f, name));
};

export type NamespaceOptions = {
    exported?: boolean;
};

/**
 * @see https://github.com/microsoft/TypeScript/issues/19030#issuecomment-335247446
 * @summary creates a namespace declaration
 * @param f compiler factory to use
 * @param name identifier to create the namespace with
 * @param statements statements to go
 * @param options configuration
 */
export const createNamespace = (
    f: NodeFactory,
    name: string | Identifier,
    statements: Statement[],
    { exported = false }: NamespaceOptions = {}
): ts.ModuleDeclaration => {
    const modifiers: Modifier[] = [];
    if (exported) modifiers.push(f.createModifier(ts.SyntaxKind.ExportKeyword));

    return f.createModuleDeclaration(
        undefined,
        modifiers,
        typeof name === "string" ? f.createIdentifier(name) : name,
        f.createModuleBlock(statements),
        ts.NodeFlags.Namespace
    );
};

export type EnumOptions = {
    exported?: boolean;
    constant?: boolean;
};

/**
 * @summary creates a enum declaration
 * @param f compiler factory to use
 * @param name identifier of the enum
 * @param expressions members of the enum
 * @param options configuration
 */
export const createEnum = (
    f: NodeFactory,
    name: string | Identifier,
    expressions: Map<string | Identifier, Expression>,
    { exported = false, constant = false }: EnumOptions = {}
) => {
    const modifiers: Modifier[] = [];
    if (exported) modifiers.push(f.createModifier(ts.SyntaxKind.ExportKeyword));
    if (constant) modifiers.push(f.createModifier(ts.SyntaxKind.ConstKeyword));

    const members: EnumMember[] = [];
    expressions.forEach((expression, name) => {
        members.push(f.createEnumMember(name, expression));
    });

    return f.createEnumDeclaration(
        undefined,
        modifiers,
        typeof name === "string" ? f.createIdentifier(name) : name,
        members
    );
};
