import { ref, type ComputedRef, type Ref, type ShallowReactive } from 'vue';
import type Media from '../Media/Media';
import type SimpleProject from '../Project/SimpleProject';
import type BaseTimeline from './Timeline';

export default abstract class BaseProject {
    public abstract id: string;
    public name = ref('Untitled');
    public type: ProjectType = 'Base';

    public abstract media: ShallowReactive<Media[]>;

    public abstract selectedTimelineIndex: Ref<number>;
    public abstract timelines: ShallowReactive<BaseTimeline[]>;
    public abstract timeline: ComputedRef<BaseTimeline>;

    /**
     * Triggered when this class has been changed
     */
    public onDeepChange = new Subject<void>();

    isBaseProject = (): this is BaseProject => this.type == 'Base';
    isSimpleProject = (): this is SimpleProject => this.type == 'Simple';
}

export type ProjectType = 'Base' | 'Simple';
