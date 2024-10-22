import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { Storage, type FilePath } from '../base/Storage';
import { MediaItem, type MediaItemMetadata, type MediaItemTypes } from './Media';
import type { MediaThumbnailMetadata } from './MediaFile';

export class ChunkedMediaFileItem extends MediaItem<ChunkedMediaFileItemMetadata> {
    public id = uuidv4();
    public name = ref('');
    public type: MediaItemTypes = 'ChunkedMediaFile';

    public async loadChunk(index = 0): Promise<MediaChunkData | undefined> {
        // This method could be easily optimized if a bit of brain power is used. Depending
        // on how Daguerreo and surrounding code is implemented, this could return a stream
        // instead, but that would maybe cause issues with OPFS, unsafe read should then be used.

        const basePath = this.getMetadata('file.location');
        const offsets = this.getMetadata('source.chunkOffsets');
        if (!basePath || !offsets) {
            throw new Error('Could not get file metadata');
        }

        if (offsets[index]) {
            const offset = offsets[index];
            const file = await Storage.getStorage().readFile(basePath, offset.start, offset.size);

            if (!file) {
                return undefined;
            } else {
                return { index, size: 0, data: file };
            }
        } else {
            return undefined;
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
        tracks: MediaFileTracks;
    };
    thumbnails: MediaThumbnailMetadata[];
}

export type CompatibleDecoderConfig<T = VideoDecoderConfig | AudioDecoderConfig> = Omit<
    T,
    'description'
> & {
    description?: ArrayBuffer | undefined;
};

export type MediaFileTracks = { [key: number]: MediaFileAudioTrack | MediaFileVideoTrack };
export interface MediaFileAudioTrack {
    type: 'audio';
    trackIndex: number;
    channels: number;
    sampleRate: number;
    codec: string;
    decoderConfig: CompatibleDecoderConfig<AudioDecoderConfig>;
}
export interface MediaFileVideoTrack {
    type: 'video';
    trackIndex: number;
    width: number;
    height: number;
    framerate?: number;
    codec: string;
    colorSpace?: VideoColorSpaceInit;
    decoderConfig: CompatibleDecoderConfig<VideoDecoderConfig>;
}

export interface ChunkOffset {
    start: number;
    size: number;
    trackIndex: number;
    keyFrame: boolean;
    duration?: number;
    timestamp: number;
}
