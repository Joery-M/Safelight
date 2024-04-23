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
import SimpleTimeline, { type SimpleTimelineConfig } from '../Timeline/SimpleTimeline';

export default class SimpleProject
    extends BaseProject
    implements ProjectFeatureSaving, ProjectFeatureMedia
{
    public id = uuidv4();
    public type: ProjectType = 'Simple';
    public isSaving = ref(false);

    public media = shallowReactive<Media[]>([]);

    public selectedTimelineIndex = ref(0);
    public timelines = shallowReactive<SimpleTimeline[]>([]);
    public timeline = computed(() => this.timelines.at(this.selectedTimelineIndex.value)!);

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

    public selectTimeline(timeline: SimpleTimeline) {
        const timelineIndex = this.timelines.indexOf(timeline);
        if (timelineIndex >= 0) {
            this.selectedTimelineIndex.value = timelineIndex;
        }
    }

    public createTimeline(config: SimpleTimelineConfig, selectWhenCreated = true): SimpleTimeline {
        const timeline = new SimpleTimeline(config);

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
