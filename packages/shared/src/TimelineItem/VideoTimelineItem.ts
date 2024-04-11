import { shallowRef } from 'vue';
import Media from '../Media/Media';
import BaseTimelineItem, { type TimelineItemType } from '../base/TimelineItem';

export default class VideoTimelineItem extends BaseTimelineItem {
    public type: TimelineItemType = 'Video';
    public media = shallowRef<Media>();

    public RenderVideoFrame() {}
}
