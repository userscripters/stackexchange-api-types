import type { NodeFactory } from "typescript";
import ts from "typescript";
import {
    createModuleDeclaration,
    createNamespace,
    createUnionOfPrimitives,
    PrimitiveUnionOptions,
} from "./factories.js";
import { printNodesToFile } from "./printer.js";
import { getDocument, interleave } from "./utils.js";

const addGlobalModifyingVersion = (
    factory: NodeFactory,
    namespaceName: string,
    errors: ts.Statement[]
) => {
    const ns = createNamespace(factory, namespaceName, errors);
    return createModuleDeclaration(factory, "global", [ns], {
        isAmbient: true,
        isGlobal: true,
    });
};

/**
 * @summary generates API error types
 * @param factory compiler factory to use
 * @param base API base URL to use
 * @param path API endpoint path
 * @param filePath output file path
 * @param namespaceName namespace name
 * @param globalNsName namespace name added to the UMD module
 */
export const generateErrors = async (
    factory: NodeFactory,
    base: string,
    path: string,
    filePath: string,
    namespaceName: string,
    globalNsName: string
) => {
    const document = await getDocument(base, path);
    if (!document) return;

    const nameSelector = ".mainbar .method .method-name";
    const nameElems = document.querySelectorAll(nameSelector);

    const errorNames: string[] = [];
    const errorCodes: number[] = [];

    nameElems.forEach(({ textContent }) => {
        const [name, id] = textContent!.trim().split(/\s+[-–]\s+/);
        errorNames.push(name);
        errorCodes.push(+id);
    });

    const opts: PrimitiveUnionOptions = { exported: true };

    const nodes: ts.Statement[] = [
        createUnionOfPrimitives(factory, "Name", errorNames, opts),
        createUnionOfPrimitives(factory, "Code", errorCodes, opts),
    ];

    const ns = createNamespace(factory, namespaceName, nodes, {
        exported: true,
    });

    const global = addGlobalModifyingVersion(factory, globalNsName, [ns]);

    return printNodesToFile(
        ts,
        interleave([ns, global], factory.createIdentifier("\n")),
        filePath
    );
};
