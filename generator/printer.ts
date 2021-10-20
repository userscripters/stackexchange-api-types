import { writeFile } from "fs/promises";
import type ts from "typescript";

/**
 * @summary prints an array of Nodes to a file
 * @param compiler TypeScript compiler
 * @param nodes an array of Nodes to print
 * @param filePath path to the output file
 */
export const printNodesToFile = async (
    compiler: typeof ts,
    nodes: ts.Node[],
    filePath: string
) => {
    const { factory } = compiler;

    const printer = compiler.createPrinter({
        newLine: compiler.NewLineKind.LineFeed,
    });

    const typesFile = compiler.createSourceFile(
        "types",
        "",
        compiler.ScriptTarget.Latest,
        false,
        compiler.ScriptKind.TS
    );

    const list = factory.createNodeArray(nodes);
    
    const content = printer.printList(
        compiler.ListFormat.MultiLine,
        list,
        typesFile
    );

    await writeFile(filePath, content);
};
