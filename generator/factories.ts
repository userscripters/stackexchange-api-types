import type { KeywordTypeSyntaxKind, NodeFactory, TypeNode } from "typescript";
import ts from "typescript";

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
    name: string,
    { constraint, defaults }: TypeParameterOptions
): ts.TypeParameterDeclaration => {
    return f.createTypeParameterDeclaration(
        f.createIdentifier(name),
        constraint && f.createKeywordTypeNode(constraint),
        defaults && f.createKeywordTypeNode(defaults)
    );
};
