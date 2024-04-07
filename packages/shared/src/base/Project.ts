import type { ComputedRef, Ref, ShallowReactive } from 'vue';
import type Media from '../Media/Media';
import type SimpleProject from '../Project/SimpleProject';
import type BaseTimeline from './Timeline';

export default abstract class BaseProject {
    public abstract id: string;
    public abstract name: string;
    public type: ProjectType = 'Base';

    public abstract media: ShallowReactive<Media[]>;

    protected abstract selectedTimelineIndex: Ref<number>;
    public abstract timelines: ShallowReactive<BaseTimeline[]>;
    public abstract timeline: ComputedRef<BaseTimeline>;

    isBaseProject = (): this is BaseProject => this.type == 'Base';
    isSimpleProject = (): this is SimpleProject => this.type == 'Simple';
}

export type ProjectType = 'Base' | 'Simple';
