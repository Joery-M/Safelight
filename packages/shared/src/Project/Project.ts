import { v4 as uuidv4 } from 'uuid';
import { ref, shallowReactive } from 'vue';
import { Storage, type ProjectFileTree, type ProjectFileTreeItem } from '../base/Storage';
import { refComputedDefault } from '../helpers/refComputedDefault';
import { LocaleManager } from '../Localization/LocaleManager';
import { MediaItem } from '../Media/Media';
import MediaManager from '../Storage/MediaManager';
import { Timeline, type TimelineConfig } from '../Timeline/Timeline';
import { FileTreeItem } from './ProjectFileTree';

export class Project {
    private _name = ref('');
    name = refComputedDefault(
        this._name,
        () =>
            __TEST__ ? 'Untitled' : LocaleManager.i18n.global.t('general.descriptions.untitled'),
        false
    );
    id = uuidv4();

    media = shallowReactive(new Map<string, MediaItem>());
    fileTree = new FileTreeItem(this);

    async save() {
        return await Storage.getStorage().saveProject(this);
    }
    serializeFileTree() {
        const serializeEntries = (item: FileTreeItem): { [path: string]: ProjectFileTreeItem } => {
            return Object.fromEntries(
                Array.from(item.children.values())
                    .map((item) => {
                        if (item.isDirectory) {
                            return [
                                item.id,
                                {
                                    entries: serializeEntries(item),
                                    name: item.name.value
                                }
                            ] as const;
                        } else if (item.media.value) {
                            return [
                                item.id,
                                {
                                    mediaID: item.media.value.id,
                                    name: item.name.value
                                }
                            ] as const;
                        }
                    })
                    .filter((c) => !!c)
            );
        };

        return serializeEntries(this.fileTree);
    }

    deserializeFileTree(tree: ProjectFileTree) {
        const deserializeEntries = (item: FileTreeItem, tree: ProjectFileTree) => {
            Object.entries(tree).forEach(([id, storedItem]) => {
                const newItem = new FileTreeItem(
                    this,
                    item,
                    storedItem.name,
                    'entries' in storedItem
                );
                newItem.id = id;

                if ('entries' in storedItem) {
                    deserializeEntries(newItem, storedItem.entries);
                } else if ('mediaID' in storedItem) {
                    // Get media from filled media lookup
                    const media = this.media.get(storedItem.mediaID);
                    newItem.media.value = media;
                }

                item.children.add(newItem);
            });
        };

        deserializeEntries(this.fileTree, tree);
    }

    async createTimeline(config: TimelineConfig, addToRootFileTree = true): Promise<Timeline> {
        const timeline = new Timeline(config);

        this.media.set(timeline.id, timeline);
        if (addToRootFileTree) {
            this.fileTree.addFile(timeline);
        }
        await this.save();

        return timeline;
    }

    async loadFile(file: File, addToFileRootTree = true) {
        const media = await MediaManager.storeMedia(file);
        if (media) {
            this.media.set(media.id, media);
            if (addToFileRootTree) {
                this.fileTree.addFile(media);
            }
            await this.save();
            return media;
        }
    }
}
