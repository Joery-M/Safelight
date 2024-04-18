import { v4 as uuidv4 } from 'uuid';
import { ref, shallowReactive } from 'vue';
import BaseTimeline, { type TimelineType } from '../base/Timeline';
import type BaseTimelineItem from '../base/TimelineItem';
import type Media from '../Media/Media';

export default class SimpleTimeline extends BaseTimeline {
    public name = 'Untitled';
    public id = uuidv4();
    public type: TimelineType = 'Simple';

    public items = shallowReactive<BaseTimelineItem[]>([]);

    public duration = ref(0);
    public width = ref(1920);
    public height = ref(1080);
    public framerate = ref(60);

    constructor() {
        super();
        this.duration.value = 0;
        this.width.value = 1920;
        this.height.value = 1080;
        this.framerate.value = 60;
    }

    /**
     * Called when an item is dropped in the timeline
     */
    public itemDropped(otherItem: BaseTimelineItem) {
        this.items
            .filter(
                (i) =>
                    i.layer.value === otherItem.layer.value &&
                    i.end.value > otherItem.start.value &&
                    i.start.value < otherItem.end.value &&
                    i.id !== otherItem.id
            )
            .forEach((item) => {
                item.onDroppedOn(otherItem);
            });
    }

    public usesMedia(media: Media) {
        return this.items.some(
            (item) => (item.isVideo() || item.isAudio()) && item.media.value == media
        );
    }
}
