import { v4 as uuidv4 } from 'uuid';
import type Media from '../Media/Media';
import AVTimelineItem from '../TimelineItem/AVTimelineItem';
import BaseTimeline, { type TimelineType } from '../base/Timeline';
import type BaseTimelineItem from '../base/TimelineItem';

export default class SimpleTimeline extends BaseTimeline {
    public name = 'Untitled';
    public id = uuidv4();
    public type: TimelineType = 'Simple';

    public items: BaseTimelineItem[] = reactive([]);

    public duration = 0;
    public viewportWidth = 1920;
    public viewportWeight = 1080;
    public framerate = 60;

    constructor() {
        super();
        this.duration = 0;
        this.width = 1920;
        this.height = 1080;
        this.framerate = 60;
    }

    createTimelineItem(media: Media) {
        console.log(media);
        const ti = new AVTimelineItem(this);

        ti.media.value = media;
        ti.layer = this.items.length;
        this.items.push(ti);

        return ti;
    }

    updateDuration() {}
}
