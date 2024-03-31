import { ref } from 'vue';
import Media from '../Media/Media';
import type SimpleTimeline from '../Timeline/SimpleTimeline';
import BaseTimelineItem, { type TimelineItemType } from '../base/TimelineItem';

export default class AVTimelineItem extends BaseTimelineItem {
    public type: TimelineItemType = 'AudioVideo';
    public media = ref<Media>();

    constructor(public parentTimeline: SimpleTimeline) {
        super();
    }

    public RenderVideoFrame() {}
}
