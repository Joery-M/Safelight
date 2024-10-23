import { v4 as uuidv4 } from 'uuid';
import { ref, shallowReactive, shallowRef, watch } from 'vue';
import { MediaItem } from '../Media/Media';
import type { Project } from './Project';
import { Storage } from '../base/Storage';

export class FileTreeItem {
    id = uuidv4();

    name = ref('');

    children = shallowReactive(new Set<FileTreeItem>());
    media = shallowRef<MediaItem>();
    parent = shallowRef<FileTreeItem>();

    constructor(
        private project: Project,
        parent?: FileTreeItem,
        name?: string,
        public isDirectory = false
    ) {
        if (name) this.name.value = name;
        if (parent) this.parent.value = parent;
    }

    setMedia(media: MediaItem) {
        this.media.value = media;
        this.name.value = media.name.value;
        this.project.save();
    }

    setName(newName: string) {
        this.name.value = newName;
        this.project.save();
    }

    addFile(media: MediaItem) {
        const file = new FileTreeItem(this.project, this);
        file.setMedia(media);

        this.children.add(file);
        this.project.save();
    }

    addDirectory(name: string) {
        const dir = new FileTreeItem(this.project, this, name, true);
        this.children.add(dir);
        this.project.save();
    }

    deleteChild(id: string): void;
    deleteChild(item: FileTreeItem): void;
    deleteChild(item: string | FileTreeItem) {
        if (typeof item === 'string') {
            const child = this.children.values().find((c) => c.id == item);
            if (!child) return false;

            item = child;
        }

        this.children.delete(item);
        this.project.save();
    }

    async deleteSelf() {
        if (!this.parent.value) return;
        if (this.media.value) {
            this.project.media.delete(this.media.value.id);

            Storage.getStorage().deleteMedia(this.media.value);
        }
        this.parent.value.deleteChild(this);
        await this.project.save();
    }
}
