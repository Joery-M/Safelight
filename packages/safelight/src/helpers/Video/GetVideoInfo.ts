import { FFprobeWorker } from 'ffprobe-wasm';
import MimeMatcher from 'mime-matcher';

export async function getVideoInfo(file: File) {
    const isVideo = new MimeMatcher('video/*').match(file.type);

    if (!isVideo) return;

    const worker = new FFprobeWorker();

    const fileInfo = await worker.getFileInfo(file);

    worker.terminate();
    return fileInfo;
}
