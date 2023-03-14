//
// Unlike ton-compiler's compileFunc this function don't include stdlib.fc
//
import {compileFunc as comp} from "@ton-community/func-js";
import {Cell} from "ton";

export async function compileFunc(source: string): Promise<{ fiftContent: string, cell: Cell }> {
    let result = await comp({
        // Targets of your project
        targets: ['main.fc'],
        // Sources
        sources: {
            "main.fc": source,
        }
    })
    if (result.status === 'error') {
        throw new Error(result.message)
    }

    // result.codeBoc contains base64 encoded BOC with code cell
    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    return {fiftContent: result.fiftCode, cell: codeCell};
}

