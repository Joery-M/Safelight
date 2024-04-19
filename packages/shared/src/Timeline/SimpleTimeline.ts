import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive } from 'vue';
import BaseTimeline, { type TimelineType } from '../base/Timeline';
import type BaseTimelineItem from '../base/TimelineItem';
import type Media from '../Media/Media';

export default class SimpleTimeline extends BaseTimeline {
    public name = ref('Untitled');
    public id = uuidv4();
    public type: TimelineType = 'Simple';

    public items = shallowReactive(new Set<BaseTimelineItem>());

    public width = ref(1920);
    public height = ref(1080);
    public framerate = ref(60);
    /**
     * Duration of a single frame in milliseconds
     */
    public frameDuration = computed(() => {
        return 1000 / this.framerate.value;
    });

    constructor(config: SimpleTimelineConfig) {
        super();
        if (config.name) {
            this.name.value = config.name;
        }
        this.width.value = config.width;
        this.height.value = config.height;
        this.framerate.value = config.framerate;
    }

    /**
     * Called when an item is dropped in the timeline
     */
    public itemDropped(otherItem: BaseTimelineItem) {
        this.items.forEach((item) => {
            if (
                item.layer.value === otherItem.layer.value &&
                item.end.value > otherItem.start.value &&
                item.start.value < otherItem.end.value &&
                item.id !== otherItem.id
            ) {
                item.onDroppedOn(otherItem);
            }
        });
    }

    public usesMedia(media: Media) {
        for (const item of this.items) {
            return item.hasMedia() && item.media.value == media;
        }
        return false;
    }

    public deleteItem(item: BaseTimelineItem) {
        item.Delete();
        return this.items.delete(item);
    }
}

export interface SimpleTimelineConfig {
    name?: string;
    width: number;
    height: number;
    framerate: number;
}
