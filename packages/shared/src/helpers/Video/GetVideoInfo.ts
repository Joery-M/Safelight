import MediaInfoFactory, { type MediaInfoType, type ReadChunkFunc } from 'mediainfo.js';
import MimeMatcher from 'mime-matcher';

export async function getVideoInfo(file: File) {
    return new Promise<MediaInfoType>((resolve, reject) => {
        const isVideo = new MimeMatcher('video/*').match(file.type);

        if (!isVideo) reject('File is not a video');

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
            locateFile(url, scriptDirectory) {
                console.log(url, scriptDirectory);
                return '';
            }
        }).then(async (mediaInfo) => {
            const data = await mediaInfo.analyzeData(() => file.size, readChunk);

            console.log(data);
            resolve(data);
        });
    });
}
