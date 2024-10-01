import { useObservable } from '@vueuse/rxjs';
import { debounceTime, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive, watch } from 'vue';
import BaseProject, {
    type ProjectFeatureMedia,
    type ProjectFeatureSaving,
    type ProjectType
} from '../base/Project';
import { Storage } from '../base/Storage';
import Media from '../Media/Media';
import MediaManager from '../Storage/MediaManager';
import { type TimelineConfig, Timeline } from '../Timeline/Timeline';

export default class SimpleProject
    extends BaseProject
    implements ProjectFeatureSaving, ProjectFeatureMedia
{
    public id = uuidv4();
    public type: ProjectType = 'Simple';
    public isSaving = ref(false);

    public media = shallowReactive<Media[]>([]);

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
        const res = await Storage.getStorage().SaveProject(this);
        this.isSaving.value = false;
        return res;
    }

    public usesMedia(media: Media) {
        return this.timelines.some((timeline) => timeline.usesMedia(media));
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

    public loadFile(file: File) {
        return new Promise<boolean>((resolve) => {
            const storingProcessing = useObservable(
                MediaManager.StoreMedia(file).pipe(takeUntil(this.destroy$))
            );
            watch(storingProcessing, (s) => {
                console.log(s?.type, s?.hashProgress);
            });

            watch(storingProcessing, async () => {
                if (storingProcessing.value && storingProcessing.value.type == 'done') {
                    const existingMedia = this.media.some(
                        (m) => m.id == storingProcessing.value!.id
                    );

                    if (!existingMedia) {
                        const media = await Storage.getStorage().LoadMedia(
                            storingProcessing.value.id!
                        );

                        if (media) {
                            this.media.push(media);

                            await this.Save();
                            resolve(true);
                        }
                    }

                    resolve(false);
                }
            });
        });
    }
}
