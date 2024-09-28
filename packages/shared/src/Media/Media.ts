export abstract class MediaItem<Metadata = MediaItemMetadata> {
    public abstract id: string;
    public abstract name: string;
    public abstract type: MediaItemTypes;

    protected metadata = new Map<string, any>();

    public getMetadata<K extends keyof Metadata, Data extends Metadata[K]>(part?: K): Data | null {
        if (typeof part === 'string') {
            return this.metadata.get(part ?? 'media');
        } else {
            return null;
        }
    }
    public addMetadata(part: string, data: any) {
        this.metadata.set(part, data);
    }
}

export type MediaItemTypes = 'ChunkedMediaFile' | 'MediaFile' | 'Timeline';

export interface MediaItemMetadata {
    media: {
        created: string;
    };
}
