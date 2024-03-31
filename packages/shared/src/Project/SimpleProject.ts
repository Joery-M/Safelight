import Media from '../Media/Media';
import SimpleTimeline from '../Timeline/SimpleTimeline';
import BaseProject, { type ProjectType } from '../base/Project';

export default class SimpleProject extends BaseProject {
    public name = 'Untitled';
    public type: ProjectType = 'Simple';

    public media: Media[] = [];
    public timelines: SimpleTimeline[] = [];
    public activeTimeline: number;

    constructor() {
        super();

        const tl = new SimpleTimeline();

        this.timelines = [tl];
        this.activeTimeline = 0;
    }
}
