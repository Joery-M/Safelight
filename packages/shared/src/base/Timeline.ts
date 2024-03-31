import type SimpleTimeline from '../Timeline/SimpleTimeline';

export default abstract class BaseTimeline {
    public abstract name: string;
    public abstract id: string;
    public type: TimelineType = 'Base';

    public width = 1920;
    public height = 1080;

    public abstract duration: number;

    isBaseTimeline = (): this is BaseTimeline => this.type == 'Base';
    isSimpleTimeline = (): this is SimpleTimeline => this.type == 'Simple';
}

export type TimelineType = 'Base' | 'Simple';
