import type SimpleProject from '../Project/SimpleProject';
import type Media from '../Media/Media';
import type BaseTimeline from './Timeline';

export default abstract class BaseProject {
    public abstract name: string;
    public type: ProjectType = 'Base';

    public abstract media: Media[];
    public abstract timelines: BaseTimeline[];

    isBaseProject(): this is BaseProject {
        return this.type == 'Base';
    }
    isSimpleProject(): this is SimpleProject {
        return this.type == 'Simple';
    }
}

export type ProjectType = 'Base' | 'Simple';
