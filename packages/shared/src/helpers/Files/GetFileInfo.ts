import MediaInfoFactory, { type MediaInfoType, type ReadChunkFunc } from 'mediainfo.js';
import MediaInfoWasmUrl from 'mediainfo.js/MediaInfoModule.wasm?url';

export async function getFileInfo(file: File) {
    return new Promise<MediaInfoType>((resolve, reject) => {
        const readChunk: ReadChunkFunc = (chunkSize, offset) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event: ProgressEvent<FileReader>) => {
                    if (event.target?.error) {
                        reject(event.target.error);
                    }
                    resolve(new Uint8Array(event.target?.result as ArrayBuffer));
                };
                reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
            });

        MediaInfoFactory({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            locateFile(_url, _scriptDirectory) {
                return MediaInfoWasmUrl;
            }
        })
            .then(async (mediaInfo) => {
                const data = await mediaInfo.analyzeData(() => file.size, readChunk);

                resolve(data);
            })
            .catch(reject);
    });
}
