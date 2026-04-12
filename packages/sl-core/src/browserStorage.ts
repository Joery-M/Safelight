/**
 * To minimize jumps between Rust and JavaScript, implementing basic OPFS
 * handling in JS leads to better code readability and probably performance.
 */

export class JsBrowserFile {
    constructor(private handle: FileSystemFileHandle) {}

    async read(): Promise<Uint8Array> {
        const file = await this.handle.getFile();
        return await file.bytes();
    }

    async size(): Promise<number> {
        const file = await this.handle.getFile();
        return file.size;
    }

    async write(data: Uint8Array): Promise<undefined> {
        const writable = await this.handle.createWritable();
        if (data.buffer instanceof SharedArrayBuffer) {
            // Copy shared buffer into own buffer
            const newBuffer = new ArrayBuffer(data.byteLength);
            const newBufferView = new Uint8Array(newBuffer);
            newBufferView.set(data);
            await writable.write(newBuffer);
        } else {
            await writable.write(data.buffer);
        }
    }

    async writeFromBlob(data: Blob): Promise<undefined> {
        const writable = await this.handle.createWritable();
        await writable.write(data);
        await writable.close();
    }
}

export async function getOPFSFile(path: string[]): Promise<JsBrowserFile> {
    let cur_dir = await navigator.storage.getDirectory();

    for (let i = 0; i < path.length; i++) {
        const section = path[i];
        if (i == path.length - 1) {
            // Last one, get file
            const handle = await cur_dir.getFileHandle(section);
            return new JsBrowserFile(handle);
        } else {
            // Get recursive directory
            cur_dir = await cur_dir.getDirectoryHandle(section);
        }
    }
    throw new Error('File not found');
}

export async function getOrCreateOPFSFile(path: string[]): Promise<JsBrowserFile> {
    let cur_dir = await navigator.storage.getDirectory();

    for (let i = 0; i < path.length; i++) {
        const section = path[i];
        if (i == path.length - 1) {
            // Last one, get file
            const handle = await cur_dir.getFileHandle(section, { create: true });
            return new JsBrowserFile(handle);
        } else {
            // Get recursive directory
            cur_dir = await cur_dir.getDirectoryHandle(section, { create: true });
        }
    }
    // TODO: Better document why this could go wrong
    throw new Error('File not found');
}
