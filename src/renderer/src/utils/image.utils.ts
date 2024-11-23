import { log } from 'node:console'
import { readFile } from 'node:fs/promises'

class ImageUtils {
    constructor() {}

    static async encodeBase64(file: Blob): Promise<string> {
        const buffer = Buffer.from(await file.arrayBuffer());
        return `data:${file.type};base64,${buffer.toString('base64')}`;
    }
}
async function a() {
    const blob = new Blob([await readFile('/Users/a1/Art Hall/sig.png')])
    ImageUtils.encodeBase64(blob).then((r) => log(r))
}

a()