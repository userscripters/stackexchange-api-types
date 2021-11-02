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

export type ModuleDeclarationOptions = {
    exported?: boolean;
    isAmbient?: boolean;
    isNamespace?: boolean;
    isGlobal?: boolean;
};

/**
 * @summary creates a module declaration
 * @param f compiler factory to use
 * @param name identifier to create the module with
 * @param statements statements to make up the body
 * @param options configuration
 */
export const createModuleDeclaration = (
    f: NodeFactory,
    name: string | Identifier,
    statements: Statement[],
    {
        exported = false,
        isGlobal = false,
        isNamespace = false,
        isAmbient = false,
    }: ModuleDeclarationOptions = {}
) => {
    const modifiers: Modifier[] = [];
    if (exported) modifiers.push(f.createModifier(ts.SyntaxKind.ExportKeyword));
    if (isAmbient)
        modifiers.push(f.createModifier(ts.SyntaxKind.DeclareKeyword));

    const flagMap: Map<boolean, ts.NodeFlags> = new Map();
    flagMap.set(isNamespace, ts.NodeFlags.Namespace);
    flagMap.set(isGlobal, ts.NodeFlags.GlobalAugmentation);

    return f.createModuleDeclaration(
        undefined,
        modifiers,
        typeof name === "string" ? f.createIdentifier(name) : name,
        f.createModuleBlock(statements),
        flagMap.get(true)
    );
};

export type NamespaceOptions = {
    exported?: boolean;
};

/**
 * @see https://github.com/microsoft/TypeScript/issues/19030#issuecomment-335247446
 * @summary creates a namespace declaration
 * @param f compiler factory to use
 * @param name identifier to create the namespace with
 * @param statements statements to make up the body
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

    return createModuleDeclaration(f, name, statements, {
        exported,
        isNamespace: true,
    });
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

export type PrimitiveUnionOptions = {
    exported?: boolean;
};

/**
 * @summary creates a union node with primitive members
 * @param f compiler factory to use
 * @param name identifier of the enum
 * @param members list of union members
 */
export const createUnionOfPrimitives = (
    f: NodeFactory,
    name: string | Identifier,
    members: (string | number | boolean | bigint)[],
    { exported = false }: PrimitiveUnionOptions = {}
) => {
    const modifiers: Modifier[] = [];
    if (exported) modifiers.push(f.createModifier(ts.SyntaxKind.ExportKeyword));

    const hs = new Map();
    hs.set("string", (v: string) => f.createStringLiteral(v));
    hs.set("number", (v: number) => f.createNumericLiteral(v));
    hs.set("boolean", (v: boolean) => (v ? f.createTrue() : f.createFalse()));
    hs.set("bigint", (v: ts.PseudoBigInt) => f.createBigIntLiteral(v));

    const union = f.createUnionTypeNode(
        members.map((type) =>
            f.createLiteralTypeNode(hs.get(typeof type)(type))
        )
    );

    return f.createTypeAliasDeclaration(
        undefined,
        modifiers,
        typeof name === "string" ? f.createIdentifier(name) : name,
        undefined,
        union
    );
};

/**
 * @summary creates a named import with a list of import specifiers
 * @param f compiler factory to use
 * @param specifier module specifier (reference)
 * @param names list of import specifier names
 */
export const createNamedImport = (
    f: NodeFactory,
    specifier: string,
    names: string[]
) => {
    const specifiers = names.map((name) => {
        return f.createImportSpecifier(
            void -0,
            typeof name === "string" ? f.createIdentifier(name) : name
        );
    });

    return f.createImportDeclaration(
        undefined,
        undefined,
        f.createImportClause(true, undefined, f.createNamedImports(specifiers)),
        f.createStringLiteral(specifier)
    );
};
