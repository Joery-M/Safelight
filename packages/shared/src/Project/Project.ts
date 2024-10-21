import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive } from 'vue';
import { refComputedDefault } from '../helpers/refComputedDefault';
import { LocaleManager } from '../Localization/LocaleManager';
import { MediaItem } from '../Media/Media';
import MediaManager from '../Storage/MediaManager';
import { type TimelineConfig, Timeline } from '../Timeline/Timeline';
import { Storage } from '../base/Storage';

export class Project {
    private _name = ref('');
    public name = refComputedDefault(
        this._name,
        () =>
            __TEST__ ? 'Untitled' : LocaleManager.i18n.global.t('general.descriptions.untitled'),
        false
    );
    public id = uuidv4();

    public media = shallowReactive(new Map<string, MediaItem>());

    public selectedTimeline = ref<string>();
    public timeline = computed(() =>
        this.selectedTimeline.value ? this.media.get(this.selectedTimeline.value) : undefined
    );

    public async save() {
        return await Storage.getStorage().saveProject(this);
    }

    public selectTimeline(timeline: Timeline) {
        this.selectedTimeline.value = timeline.id;
    }

    public createTimeline(config: TimelineConfig, openOnCreate = true): Timeline {
        const timeline = new Timeline(config);

        this.media.set(timeline.id, timeline);

        if (openOnCreate) {
            this.selectTimeline(timeline);
        }

        return timeline;
    }

    public async loadFile(file: File) {
        const media = await MediaManager.storeMedia(file);
        if (media) {
            this.media.set(media.id, media);
            return true;
        } else {
            return false;
        }
    }
}
