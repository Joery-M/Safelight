import type Media from '../Media/Media';
import BaseTimeline, { type TimelineType } from '../base/Timeline';
import { v4 as uuidv4 } from 'uuid';
import type BaseTimelineItem from '../base/TimelineItem';
import AVTimelineItem from '../TimelineItem/AVTimelineItem';

export default class SimpleTimeline extends BaseTimeline {
    public name = 'Untitled';
    public id = uuidv4();
    public type: TimelineType = 'Simple';

    public items: BaseTimelineItem[] = reactive([]);

    public duration = 0;
    public width = 1920;
    public height = 1080;
    public framerate = 60;

    constructor() {
        super();
        this.duration = 0;
        this.width = 1920;
        this.height = 1080;
        this.framerate = 60;
    }

    createTimelineItem(mediaId: string) {
        const ti = new AVTimelineItem(this);

        ti.load(mediaId);
        ti.layer = this.items.length;
        this.items.push(ti);

        return ti;
    }

    updateDuration() {}
}
