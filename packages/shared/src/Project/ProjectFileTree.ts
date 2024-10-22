import { v4 as uuidv4 } from 'uuid';
import { ref, shallowReactive } from 'vue';
import { MediaItem } from '../Media/Media';

export class FileTreeItem {
    id = uuidv4();

    name = ref('');

    children = shallowReactive(new Set<FileTreeItem>());
    media = ref<MediaItem>();

    constructor(
        name?: string,
        public isDirectory = false,
        media?: MediaItem
    ) {
        if (name) this.name.value = name;
        if (media) this.media.value = media;
    }

    addFile(media: MediaItem) {
        const file = new FileTreeItem(media.name.value, false, media);
        this.children.add(file);
    }

    addDirectory(name: string) {
        const dir = new FileTreeItem(name, true);
        this.children.add(dir);
    }

    deleteChild(id: string): boolean;
    deleteChild(item: FileTreeItem): boolean;
    deleteChild(item: string | FileTreeItem): boolean {
        if (typeof item === 'string') {
            const child = this.children.values().find((c) => c.id == item);
            if (!child) return false;

            item = child;
        }

        return this.children.delete(item);
    }
}
