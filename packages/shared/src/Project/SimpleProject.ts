import { debounceTime, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive } from 'vue';
import BaseProject, { type ProjectType } from '../base/Project';
import { Storage } from '../base/Storage';
import Media from '../Media/Media';
import SimpleTimeline, { type SimpleTimelineConfig } from '../Timeline/SimpleTimeline';

export default class SimpleProject extends BaseProject {
    public id = uuidv4();
    public type: ProjectType = 'Simple';

    public media = shallowReactive<Media[]>([]);

    public selectedTimelineIndex = ref(0);
    public timelines = shallowReactive<SimpleTimeline[]>([]);
    public timeline = computed(() => this.timelines.at(this.selectedTimelineIndex.value)!);

    constructor() {
        super();

        this.onDeepChange.pipe(takeUntil(this.destroy$), debounceTime(1000)).subscribe(() => {
            Storage.getStorage().SaveProject(this);
        });
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
}
