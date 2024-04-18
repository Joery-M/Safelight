import { ref, shallowRef } from 'vue';
import Media, { type VideoTrackInfo } from '../Media/Media';
import BaseTimelineItem, { type TimelineItemType } from '../base/TimelineItem';

export default class VideoTimelineItem extends BaseTimelineItem {
    public type: TimelineItemType = 'Video';
    public media = shallowRef<Media>();

    /**
     * Offset from the start of this timeline item to the start of the video track.
     */
    public startOffset = ref(0);
    /**
     * Total duration of this video track.
     */
    public duration = ref(0);

    public trackInfo = ref<VideoTrackInfo>();

    // TODO: Create a whole extensible rendering engine (lol)
    public RenderVideoFrame() {
        throw new Error('Not implemented');
    }
}
