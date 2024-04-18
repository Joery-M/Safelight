import SimpleTimeline from '../Timeline/SimpleTimeline';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive } from 'vue';
import { default as BaseProject, type ProjectType } from '../base/Project';
import Media from '../Media/Media';

export default class SimpleProject extends BaseProject {
    public id = uuidv4();
    public name = 'Untitled';
    public type: ProjectType = 'Simple';

    public media = shallowReactive<Media[]>([]);

    public selectedTimelineIndex = ref(0);
    public timelines = shallowReactive<SimpleTimeline[]>([]);
    public timeline = computed(() => this.timelines.at(this.selectedTimelineIndex.value)!);

    public usesMedia(media: Media) {
        return this.timelines.some((timeline) => timeline.usesMedia(media));
    }
}
