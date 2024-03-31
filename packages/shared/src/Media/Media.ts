import { type FileInfo } from 'ffprobe-wasm';
import { ref } from 'vue';

export default class Media {
    public id = ref<string>();
    public name = ref('Untitled Media');
    public previewImage = ref<string>();
    public loaded = ref(false);

    /**
     * @description The duration of this media item. By default it is set to 5 seconds, which will apply to images
     * @default 5000
     */
    public duration = ref(5000);
    public fileInfo = ref<FileInfo>();

    constructor(public mediaId: string) {
        db.media.get({ id: mediaId }).then((med) => {
            if (med) {
                this.name.value = med.name;

                if (med.fileInfo)
                    this.duration.value = parseFloat(med.fileInfo.format.duration) * 1000;
                if (med.previewImage)
                    this.previewImage.value = URL.createObjectURL(med.previewImage);

                this.id.value = med.id;
                this.loaded.value = true;

                setInterval(() => {
                    this.duration.value += 100;
                }, 1000);
            }
        });
    }
}
