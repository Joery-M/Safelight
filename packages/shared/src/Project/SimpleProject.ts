import SimpleTimeline from '@/Timeline/SimpleTimeline';
import { computed, ref, shallowReactive } from 'vue';
import Media from '../Media/Media';
import { v4 as uuidv4 } from 'uuid';
import BaseProject, { type ProjectType } from '../base/Project';

export default class SimpleProject extends BaseProject {
    public id = uuidv4();
    public name = 'Untitled';
    public type: ProjectType = 'Simple';

    public media = shallowReactive<Media[]>([]);

    protected selectedTimelineIndex = ref(0);
    public timelines = shallowReactive<SimpleTimeline[]>([]);
    public timeline = computed(() => this.timelines.at(this.selectedTimelineIndex.value)!);
}
