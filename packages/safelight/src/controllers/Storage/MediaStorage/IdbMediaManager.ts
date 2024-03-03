import { generateMediaThumbnail } from '@/helpers/Video/GenerateMediaThumbnail';
import { getVideoInfo } from '@/helpers/Video/GetVideoInfo';
import { createMD5 } from 'hash-wasm';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import type { StoredMedia } from '../db';

const chunkSize = 64 * 1024 * 1024;

export default class IdbMediaManager {
    static storedMedia = shallowRef<StoredMedia[]>([]);

    static storeMedia(file: File) {
        return new Observable<LoadMediaProgress>((subscriber) => {
            // Thanks RxJs, makes sense
            (async () => {
                // Hash file
                const reader = new FileReader();

                const hasher = await createMD5();

                function hashChunk(chunk: Blob) {
                    return new Promise<void>((resolve) => {
                        reader.onload = async (e) => {
                            const view = new Uint8Array(e.target!.result! as ArrayBuffer);
                            hasher.update(view);
                            resolve();
                        };

                        reader.readAsArrayBuffer(chunk);
                    });
                }

                const chunkNumber = Math.ceil(file.size / chunkSize);

                for (let i = 0; i <= chunkNumber; i++) {
                    const chunk = file.slice(
                        chunkSize * i,
                        Math.min(chunkSize * (i + 1), file.size)
                    );
                    await hashChunk(chunk);
                    subscriber.next({
                        hashProgress: Math.min(i / chunkNumber, 1),
                        type: 'hash'
                    });
                }

                const hash = hasher.digest();

                // Check if a file with the same has already is stored, if so, use it
                const existingMedia = await db.media.get({
                    contentHash: hash
                });

                if (existingMedia) {
                    subscriber.next({
                        type: 'done',
                        id: existingMedia.id,
                        hashProgress: 1
                    });
                } else {
                    // Generate fileInfo
                    subscriber.next({
                        type: 'fileInfo',
                        hashProgress: 1
                    });
                    const fileInfo = await getVideoInfo(file).catch(() => {
                        return undefined;
                    });

                    // Get thumbnail
                    subscriber.next({
                        hashProgress: 1,
                        type: 'thumbnail'
                    });
                    const thumbnail = (await generateMediaThumbnail(file)) ?? undefined; // Typescript shenanigans

                    const uuid = uuidv4();

                    db.media.add({
                        id: uuid,
                        name: file.name,
                        contentHash: hash,
                        data: file,
                        fileInfo: fileInfo,
                        previewImage: thumbnail
                    });
                    subscriber.next({
                        type: 'done',
                        id: uuid,
                        hashProgress: 1
                    });
                }

                subscriber.complete();
            })();
        });
    }
}

interface LoadMediaProgress {
    type: 'fileInfo' | 'thumbnail' | 'hash' | 'done';
    id?: string;
    hashProgress: number;
}

db.media.hook.creating.subscribe(async () => {
    IdbMediaManager.storedMedia.value = await db.media.toArray();
    triggerRef(IdbMediaManager.storedMedia);
});
db.media.hook.deleting.subscribe(async () => {
    IdbMediaManager.storedMedia.value = await db.media.toArray();
    triggerRef(IdbMediaManager.storedMedia);
});
db.media.hook.updating.subscribe(async () => {
    IdbMediaManager.storedMedia.value = await db.media.toArray();
    triggerRef(IdbMediaManager.storedMedia);
});
db.media.toArray().then((media) => {
    IdbMediaManager.storedMedia.value = media;
});
