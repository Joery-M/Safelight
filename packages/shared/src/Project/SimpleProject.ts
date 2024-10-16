import { debounceTime, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive } from 'vue';
import BaseProject, {
    type ProjectFeatureMedia,
    type ProjectFeatureSaving,
    type ProjectType
} from '../base/Project';
import { Storage } from '../base/Storage';
import { MediaItem } from '../Media/Media';
import MediaManager from '../Storage/MediaManager';
import { type TimelineConfig, Timeline } from '../Timeline/Timeline';

export default class SimpleProject
    extends BaseProject
    implements ProjectFeatureSaving, ProjectFeatureMedia
{
    public id = uuidv4();
    public type: ProjectType = 'Simple';
    public isSaving = ref(false);

    public media = shallowReactive<MediaItem[]>([]);

    public selectedTimeline = ref<string>();
    public timelines = shallowReactive<Timeline[]>([]);
    // public timeline = computed(() => this.timelines.find(this.selectedTimelineIndex.value)!);
    public timeline = computed(() =>
        this.timelines.find(({ id }) => id == this.selectedTimeline.value)
    );

    constructor() {
        super();

        this.onDeepChange.pipe(takeUntil(this.destroy$), debounceTime(1000)).subscribe(() => {
            this.Save();
        });
    }

    public async Save() {
        if (this.isSaving.value) return 'Cancelled';

        this.isSaving.value = true;
        const res = await Storage.getStorage().saveProject(this);
        this.isSaving.value = false;
        return res;
    }

    public usesMedia(media: MediaItem) {
        return this.media.some((m) => m.id == media.id);
    }

    public selectTimeline(timeline: Timeline) {
        this.selectedTimeline.value = timeline.id;
    }

    public createTimeline(config: TimelineConfig, selectWhenCreated = true): Timeline {
        const timeline = new Timeline(config);

        this.timelines.push(timeline);

        if (selectWhenCreated) {
            this.selectTimeline(timeline);
        }

        return timeline;
    }

    public async loadFile(file: File) {
        const media = await MediaManager.storeMedia(file);
        if (media) {
            this.media.push(media);
            await this.Save();
            return true;
        } else {
            return false;
        }
    }
}
