import type Media from '../Media/Media';
import type SimpleProject from '../Project/SimpleProject';
import BaseTimeline, { type TimelineType } from '../base/Timeline';
import { v4 as uuidv4 } from 'uuid';
import type BaseTimelineItem from '../base/TimelineItem';
import AVTimelineItem from '../TimelineItem/AVTimelineItem';

export default class SimpleTimeline extends BaseTimeline {
    public name = 'Untitled';
    public id = uuidv4();
    public type: TimelineType = 'Simple';
    public parentProject: SimpleProject;

    public items: BaseTimelineItem[] = reactive([]);

    public duration = 0;
    public width = 1920;
    public height = 1080;
    public framerate = 60;

    constructor(project: SimpleProject) {
        super();
        this.parentProject = project;
        this.duration = 0;
        this.width = 1920;
        this.height = 1080;
        this.framerate = 60;
    }

    createTimelineItem(media: Media) {
        const ti = new AVTimelineItem(this);

        ti.load(media);
        ti.layer = this.items.length;
        this.items.push(ti);

        return ti;
    }

    updateDuration() {}
}
