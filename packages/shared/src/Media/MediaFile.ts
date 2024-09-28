import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../base/Storage';
import { MediaItem, type MediaItemMetadata, type MediaItemTypes } from './Media';

export class MediaFileItem extends MediaItem<MediaFileItemMetadata> {
    public id = uuidv4();
    public name = '';
    public type: MediaItemTypes = 'MediaFile';

    private file?: ArrayBuffer;

    async loadFile() {
        if (this.file) {
            return this.file;
        }

        const fileMeta = this.getMetadata('file');
        if (fileMeta) {
            this.file = await Storage.getStorage().ReadFile(fileMeta.location);
            return this.file;
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
    };
}
