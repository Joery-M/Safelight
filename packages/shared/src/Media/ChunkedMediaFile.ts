import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../base/Storage';
import { MediaItem, type MediaItemMetadata, type MediaItemTypes } from './Media';
import type { MediaThumbnailMetadata } from './MediaFile';

export class ChunkedMediaFileItem extends MediaItem<ChunkedMediaFileItemMetadata> {
    public id = uuidv4();
    public name = '';
    public type: MediaItemTypes = 'ChunkedMediaFile';

    public async *loadChunk(start = 0, count = 1): AsyncGenerator<MediaChunkData | undefined> {
        const basePath = await this.getMetadata('file');
        const offsets = (await this.getMetadata('chunks'))?.offsets;
        if (!basePath || !offsets) {
            throw new Error('Could not get file metadata');
        }

        for (let i = 0; i < count; i++) {
            const index = i + start;

            if (offsets[index]) {
                const offset = offsets[index];
                const file = await Storage.getStorage().ReadFile(
                    basePath.location,
                    offset.start,
                    offset.size
                );

                if (!file) {
                    yield undefined;
                } else {
                    // Decode metadata
                    if (offset.metaStart !== undefined && offset.metaSize !== undefined) {
                        const metadataFile = await Storage.getStorage().ReadFile(
                            basePath.location,
                            offset.metaStart,
                            offset.metaSize
                        );
                        if (metadataFile) {
                            const decoder = new TextDecoder();

                            try {
                                const jsonResult = JSON.parse(decoder.decode(metadataFile));
                                const metadata = new Map(Object.entries(jsonResult));
                                yield { index, size: file.byteLength, data: file, metadata };
                            } catch (error) {
                                console.error('Error reading JSON metadata', error);
                                yield { index, size: 0, data: file };
                            }
                        }
                    } else {
                        yield { index, size: 0, data: file };
                    }
                }
            } else {
                yield undefined;
            }
        }
    }

    async getThumbnail(time = 0) {
        const thumbnails = (this.metadata.get('thumbnails') ?? []) as MediaThumbnailMetadata[];

        const curThumbnail = thumbnails
            .sort((a, b) => a.time - b.time)
            .findLast((t) => t.time <= time);
        if (curThumbnail) {
            return await Storage.getStorage().ReadFile(curThumbnail.location);
        }
    }
}

export interface MediaChunkData {
    index: number;
    size: number;
    metadata?: Map<string, any>;
    data: ArrayBuffer;
}

export interface ChunkedMediaFileItemMetadata extends MediaItemMetadata {
    file: {
        location: string[];
        /**
         * File size in bytes
         */
        size: number | bigint;
        /**
         * Original filename
         */
        name?: string;
    };
    chunks: {
        offsets: {
            [index: number]: { start: number; size: number; metaStart?: number; metaSize?: number };
        };
    };
    thumbnails: MediaThumbnailMetadata[];
}
