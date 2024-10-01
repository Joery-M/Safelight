import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../base/Storage';
import { MediaItem, type MediaItemMetadata, type MediaItemTypes } from './Media';

export class MediaFileItem extends MediaItem<MediaFileItemMetadata> {
    public id = uuidv4();
    public name = '';
    public type: MediaItemTypes = 'MediaFile';

    private file?: ArrayBuffer;

    public addMetadata<K extends keyof MediaFileItemMetadata>(
        part: K,
        data: MediaFileItemMetadata[K]
    ) {
        // If file has changed (idk how), make it undefined
        if (part == 'file') {
            this.file = undefined;
        }
        return super.addMetadata(part, data);
    }

    async loadFile() {
        if (this.file) {
            return this.file;
        }

        const fileMeta = await this.getMetadata('file');
        if (fileMeta) {
            this.file = await Storage.getStorage().ReadFile(fileMeta.location);
            return this.file;
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

export interface MediaFileItemMetadata extends MediaItemMetadata {
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
    thumbnails: MediaThumbnailMetadata[];
}

export interface MediaThumbnailMetadata {
    /**
     * Time in milliseconds where this thumbnail is from
     *
     * If the file only has 1 thumbnail, this value should be set to 0.
     */
    time: number;
    location: string[];
}
