import { ref, shallowRef } from 'vue';
import Media, { type VideoTrackInfo } from '../Media/Media';
import BaseTimelineItem, { type TimelineItemType } from '../base/TimelineItem';

export default class VideoTimelineItem extends BaseTimelineItem {
    public type: TimelineItemType = 'Video';
    public media = shallowRef<Media>();

    public startOffset = ref(0);
    public duration = ref(0);

    public trackInfo = ref<VideoTrackInfo>();

    public RenderVideoFrame() {}
}
