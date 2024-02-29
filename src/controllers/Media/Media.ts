import { v4 as uuidv4 } from 'uuid';
import { FFprobeWorker, type FileInfo } from 'ffprobe-wasm';

export default class Media {
    public id = uuidv4();
    public name = 'Untitled Media';
    public previewImage = '';
    public loaded = false;

    /**
     * @description The duration of this media item. By default it is set to 5 seconds, which will apply to images
     * @default 5000
     */
    public duration = 5000;
    public fileInfo?: FileInfo;

    constructor(public source: File) {
        this.name = source.name;
    }
}
