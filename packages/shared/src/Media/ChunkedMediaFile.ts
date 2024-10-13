import { v4 as uuidv4 } from 'uuid';
import { Storage, type FilePath } from '../base/Storage';
import { MediaItem, type MediaItemMetadata, type MediaItemTypes } from './Media';
import type { MediaThumbnailMetadata } from './MediaFile';

export class ChunkedMediaFileItem extends MediaItem<ChunkedMediaFileItemMetadata> {
    public id = uuidv4();
    public name = '';
    public type: MediaItemTypes = 'ChunkedMediaFile';

    public async *loadChunk(start = 0, count = 1): AsyncGenerator<MediaChunkData | undefined> {
        const basePath = this.getMetadata('file.location');
        const offsets = this.getMetadata('source.chunkOffsets');
        if (!basePath || !offsets) {
            throw new Error('Could not get file metadata');
        }

        for (let i = 0; i < count; i++) {
            const index = i + start;

            if (offsets[index]) {
                const offset = offsets[index];
                const file = await Storage.getStorage().readFile(
                    basePath,
                    offset.start,
                    offset.size
                );

                if (!file) {
                    yield undefined;
                } else {
                    yield { index, size: 0, data: file };
                }
            } else {
                yield undefined;
            }
        }
    }

    async getThumbnail(time = 0) {
        const thumbnails = (this.getMetadata('thumbnails') ?? []) as MediaThumbnailMetadata[];

        const curThumbnail = thumbnails
            .sort((a, b) => a.time - b.time)
            .findLast((t) => t.time <= time);
        if (curThumbnail) {
            return await Storage.getStorage().readFile(curThumbnail.location);
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
        location: FilePath;
        /**
         * File size in bytes
         */
        size: number | bigint;
        /**
         * Original filename
         */
        name?: string;
    };
    source: {
        chunkOffsets: ChunkOffset[];
        tracks: {
            [key: number]: CompatibleDecoderConfig;
        };
    };
    thumbnails: MediaThumbnailMetadata[];
}

export type CompatibleDecoderConfig<T = VideoDecoderConfig | AudioDecoderConfig> = Omit<
    T,
    'description'
> & {
    description?: ArrayBuffer | undefined;
};

export interface ChunkOffset {
    start: number;
    size: number;
    trackIndex: number;
    keyFrame: boolean;
    duration?: number;
    timestamp: number;
}
