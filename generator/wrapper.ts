import type { NodeFactory } from "typescript";
import ts from "typescript";
import {
    createKeywordArray,
    createNamedImport,
    createNamespace,
    createTypeParameter,
} from "./factories.js";
import { parseInterface } from "./parsers.js";
import { printNodesToFile } from "./printer.js";
import { getDocument, interleave } from "./utils.js";

/**
 * @see https://api.stackexchange.com/docs/wrapper
 * @summary generates SE API response wrapper types
 * @param factory compiler factory to use
 * @param base API base URL to use
 * @param path API endpoint path
 * @param filePath output file path
 * @param nameSelector selector for matching elements with the interface name
 * @param fieldsSelector selector for matching interface fields
 * @param modifierSelector selector for matching optional/required modifiers
 * @param unionRegex regular expression for checking if the field value is a union
 * @param namespaceName namespace name if exporting as namespace
 */
export const generateResponseWrapper = async (
    factory: NodeFactory,
    base: string,
    path: string,
    filePath: string,
    nameSelector: string,
    fieldsSelector: string,
    modifierSelector: string,
    unionRegex: RegExp,
    namespaceName: string
): Promise<void> => {
    const document = await getDocument(base, path);
    if (!document) return;

    const typeParameterName = "T";

    const typeParameter = createTypeParameter(factory, typeParameterName, {
        constraint: ts.SyntaxKind.ObjectKeyword,
        defaults: ts.SyntaxKind.ObjectKeyword,
    });

    const wrapper = parseInterface(
        factory,
        document,
        nameSelector,
        fieldsSelector,
        modifierSelector,
        unionRegex,
        {
            overrides: {
                items: createKeywordArray(factory, typeParameterName),
                error_name: factory.createTypeReferenceNode("Errors.Name"),
                error_id: factory.createTypeReferenceNode("Errors.Code"),
            },
            parameters: [typeParameter],
            exported: true,
        }
    );

    const errImports = createNamedImport(factory, "./errors", ["Errors"]);

    const namespace = createNamespace(factory, namespaceName, [wrapper], {
        exported: true,
    });

    const nodes: ts.Node[] = interleave(
        [errImports, namespace],
        factory.createIdentifier("\n")
    );

    return printNodesToFile(ts, nodes, filePath);
};
