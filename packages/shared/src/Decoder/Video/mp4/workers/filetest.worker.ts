import '../../../../../worker-types/mp4box.d.ts';

export default function (sourceFile: File) {
    const file = MP4Box.createFile();
    const reader = sourceFile.stream().getReader();

    return new Promise<boolean>((resolve) => {
        let offset = 0;

        let finished = false;

        const readChunk = (stream: ReadableStreamReadResult<Uint8Array>) => {
            if (stream.value) {
                const buffer = stream.value.buffer as unknown as MP4ArrayBuffer;
                buffer.fileStart = offset;

                offset += buffer.byteLength;

                file.appendBuffer(buffer);
            }
            if (!stream.done) {
                if (finished) return;
                reader
                    .read()
                    .then(readChunk)
                    .catch((err) => {
                        console.error('Error loading chunk', err);
                        resolve(false);
                    });
            } else {
                file.flush();
                if (!finished) {
                    resolve(false);
                }
            }
        };
        reader
            .read()
            .then(readChunk)
            .catch((err) => {
                console.error('Error loading chunk', err);
                resolve(false);
            });

        file.onReady = () => {
            resolve(true);
            finished = true;
        };
        file.onError = (e) => {
            console.error(e);
            if (!finished) {
                resolve(false);
            }
        };
    }).finally(() => {
        // Cleanup
        file.flush();
        file.stop();
        reader.cancel();
        reader.releaseLock();
    });
}
