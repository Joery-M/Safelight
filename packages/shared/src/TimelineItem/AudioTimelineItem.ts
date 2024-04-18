import { ref, shallowRef } from 'vue';
import Media, { type AudioTrackInfo } from '../Media/Media';
import BaseTimelineItem, { type TimelineItemType } from '../base/TimelineItem';

export default class AudioTimelineItem extends BaseTimelineItem {
    public type: TimelineItemType = 'Audio';
    public media = shallowRef<Media>();

    /**
     * Offset from the start of this timeline item to the start of the audio track.
     */
    public startOffset = ref(0);
    /**
     * Total duration of this audio track.
     */
    public duration = ref(0);

    public trackInfo = ref<AudioTrackInfo>();
}
