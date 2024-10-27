import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { Storage, type FilePath } from '../base/Storage';
import { MediaItem, type MediaItemMetadata, type MediaItemTypes } from './Media';

export class MediaFileItem extends MediaItem<MediaFileItemMetadata> {
    public id = uuidv4();
    public name = ref('');
    public type: MediaItemTypes = 'MediaFile';

    private file?: ArrayBuffer;

    async loadFile() {
        if (this.file) {
            return this.file;
        }

        const fileMeta = this.getMetadata('file');
        if (fileMeta) {
            this.file = await Storage.getStorage().readFile(fileMeta.location);
            return this.file;
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

export interface MediaFileItemMetadata extends MediaItemMetadata {
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
