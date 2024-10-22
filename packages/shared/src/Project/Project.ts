import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive } from 'vue';
import { Storage, type ProjectFileTreeItem } from '../base/Storage';
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
    fileTree = new FileTreeItem(undefined, true);

    selectedTimeline = ref<string>();
    timeline = computed(() => {
        const item = this.selectedTimeline.value
            ? this.media.get(this.selectedTimeline.value)
            : undefined;

        return item?.isTimeline() ? item : undefined;
    });

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

    deserializeFileTree(tree: { [path: string]: ProjectFileTreeItem }) {
        const deserializeEntries = (
            item: FileTreeItem,
            tree: { [path: string]: ProjectFileTreeItem }
        ) => {
            Object.entries(tree).forEach(([id, storedItem]) => {
                const newItem = new FileTreeItem(storedItem.name, !!storedItem.entries);
                newItem.id = id;

                if (storedItem.entries) {
                    deserializeEntries(newItem, storedItem.entries);
                } else if (storedItem.mediaID) {
                    // Get media from filled media lookup
                    const media = this.media.get(storedItem.mediaID);
                    newItem.media.value = media;
                }

                item.children.add(newItem);
            });
        };

        deserializeEntries(this.fileTree, tree);
    }

    selectTimeline(timeline: Timeline) {
        this.selectedTimeline.value = timeline.id;
    }

    createTimeline(config: TimelineConfig, openOnCreate = true): Timeline {
        const timeline = new Timeline(config);

        this.media.set(timeline.id, timeline);
        this.fileTree.addFile(timeline);

        if (openOnCreate) {
            this.selectTimeline(timeline);
        }

        return timeline;
    }

    async loadFile(file: File) {
        const media = await MediaManager.storeMedia(file);
        if (media) {
            this.media.set(media.id, media);
            this.fileTree.addFile(media);
            return true;
        } else {
            return false;
        }
    }
}
