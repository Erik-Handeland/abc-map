import * as fs from 'fs';
import * as path from 'path';

export async function readFileA(name: string): Promise<Blob> {
    const filePath = path.join(__dirname, name);
    if(!fs.existsSync(filePath)) {
        return Promise.reject(`File ${filePath} not found`);
    }
    const buffer = await fs.promises.readFile(filePath);
    const buff = fs.readFileSync(name);
    const blob = new Blob([buff]);
    return blob;
}

export async function readFileB(name: string): Promise<Blob> {
    const filePath = path.join(__dirname, name);
    if(!fs.existsSync(filePath)) {
        return Promise.reject(`File ${filePath} not found`);
    }
    const data = base64_encode(filePath);
    const blob = b64toBlob(data);
    return blob;
}

const base64_encode = (file) => {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
}
/////////////////////
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
