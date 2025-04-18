import { type Path, type PathValue, getByPath, setByPath } from 'dot-path-value';
import type { Ref } from 'vue';
import { Storage } from '../base/Storage';
import type { Timeline } from '../Timeline/Timeline';
import type { ChunkedMediaFileItem } from './ChunkedMediaFile';
import type { MediaFileItem } from './MediaFile';

export abstract class MediaItem<Metadata extends Record<string, any> = MediaItemMetadata> {
    public abstract id: string;
    public abstract name: Ref<string>;
    public abstract type: MediaItemTypes;

    protected metadata: Metadata = {} as Metadata;

    constructor(initialMetadata?: Metadata) {
        if (initialMetadata) {
            this.metadata = initialMetadata;
        }
    }

    public getMetadata<TPath extends Path<Metadata>>(part: TPath): PathValue<Metadata, TPath> {
        return getByPath(this.metadata, part);
    }
    public addMetadata<K extends Path<Metadata>>(part: K, data: PathValue<Metadata, K>) {
        this.metadata = setByPath(this.metadata, part, data);
    }

    // This function could be expanded in the future
    public async serializeMetadata(): Promise<{ [key: string | number]: any }> {
        return this.metadata ?? {};
    }

    public async save(): Promise<boolean> {
        if (!Storage.hasStorage()) return false;
        const storage = Storage.getStorage();
        const res = await storage.saveMedia(this);
        return res == 'Success';
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

    public isOfType(type: MediaSourceType) {
        const sourceType = this.getMetadata('media.sourceType' as any) as MediaSourceType;
        return (type & sourceType) !== 0;
    }
}

export type MediaItemTypes = 'ChunkedMediaFile' | 'MediaFile' | 'Timeline';

export enum MediaSourceType {
    Unknown = 0,
    /**
     * The source has audio
     */
    Audio = 1 << 0,
    /**
     * The source has video
     */
    Video = 1 << 1,
    /**
     * The source has subtitles
     */
    Subtitles = 1 << 2,
    /**
     * The source has a static image
     */
    Image = 1 << 3,
    /**
     * The source is a timeline
     */
    Timeline = 1 << 4,
    /**
     * The source requires a plugin to be used
     */
    Special = 1 << 5
}

export interface MediaItemMetadata {
    media: {
        sourceType: MediaSourceType;
        created: string;
    };
}
