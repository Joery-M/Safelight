import Media from '../Media/Media';
import type SimpleTimeline from '../Timeline/SimpleTimeline';
import type { TimelineItemType } from '../base/TimelineItem';

export default class AVTimelineItem extends TimelineItem {
    public type: TimelineItemType = 'AudioVideo';
    public media = ref<Media>();

    constructor(public parentTimeline: SimpleTimeline) {
        super();
    }

    public RenderVideoFrame() {}
}
