import { v4 as uuidv4 } from 'uuid';
import { type FileInfo } from 'ffprobe-wasm';
import { getVideoInfo } from '@/helpers/Video/GetVideoInfo';
import { generateMediaThumbnail } from '@/helpers/Video/GenerateMediaThumbnail';

export default class Media {
    public id = uuidv4();
    public name = ref('Untitled Media');
    public previewImage = ref('');
    public loaded = false;

    /**
     * @description The duration of this media item. By default it is set to 5 seconds, which will apply to images
     * @default 5000
     */
    public duration = ref(5000);
    public fileInfo = ref<FileInfo>();

    constructor(public source: File) {
        this.name.value = source.name;

        setInterval(() => {
            this.duration.value += 100;
        }, 1000);

        getVideoInfo(source).then((info) => {
            if (info) {
                this.duration.value = parseFloat(info.format.duration) * 1000;
                this.fileInfo.value = info;
            }
        });

        generateMediaThumbnail(source).then((img) => {
            this.previewImage.value = img;
        });
    }
}
