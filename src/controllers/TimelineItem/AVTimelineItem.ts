import type SimpleTimeline from '../Timeline/SimpleTimeline';
import type { TimelineItemType } from '../base/TimelineItem';

export default class AVTimelineItem extends TimelineItem {
    public type: TimelineItemType = 'AudioVideo';

    constructor(public parentTimeline: SimpleTimeline) {
        super();
    }

    public RenderVideoFrame() {}
}
