import type { Ref } from 'vue';
import type SimpleTimeline from '../Timeline/SimpleTimeline';

export default abstract class BaseTimeline {
    public abstract name: Ref<string>;
    public abstract id: string;
    public type: TimelineType = 'Base';

    isBaseTimeline = (): this is BaseTimeline => this.type == 'Base';
    isSimpleTimeline = (): this is SimpleTimeline => this.type == 'Simple';
}

export type TimelineType = 'Base' | 'Simple';
