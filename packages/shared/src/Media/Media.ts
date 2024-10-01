import type { Timeline } from '../Timeline/Timeline';
import type { ChunkedMediaFileItem } from './ChunkedMediaFile';
import type { MediaFileItem } from './MediaFile';

export abstract class MediaItem<Metadata = MediaItemMetadata> {
    public abstract id: string;
    public abstract name: string;
    public abstract type: MediaItemTypes;

    protected metadata = new Map<string, any>();

    public async getMetadata<K extends keyof Metadata>(part?: K): Promise<Metadata[K] | null> {
        if (typeof part === 'string') {
            return this.metadata.get(part ?? 'media');
        } else {
            return null;
        }
    }
    public async addMetadata<K extends keyof Metadata>(part: K, data: Metadata[K]) {
        if (typeof part === 'string') {
            this.metadata.set(part, data);
            return true;
        } else {
            return false;
        }
    }

    // This function could be expanded in the future
    public async serializeMetadata(): Promise<Map<string, any>> {
        return this.metadata;
    }

    public isMediaFile(): this is MediaFileItem {
        return this.type === 'MediaFile';
    }
    public isChunkedMediaFile(): this is ChunkedMediaFileItem {
        return this.type === 'ChunkedMediaFile';
    }
    public isTimeline(): this is Timeline {
        return this.type === 'Timeline';
    }
}

export type MediaItemTypes = 'ChunkedMediaFile' | 'MediaFile' | 'Timeline';

export interface MediaItemMetadata {
    media: {
        created: string;
    };
}
