import { ref } from 'vue';
import Media from '../Media/Media';
import BaseTimelineItem, { type TimelineItemType } from '../base/TimelineItem';

export default class AudioTimelineItem extends BaseTimelineItem {
    public type: TimelineItemType = 'Audio';
    public media = ref<Media>();
}
