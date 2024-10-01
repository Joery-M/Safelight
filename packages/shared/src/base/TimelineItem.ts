import { v4 as uuidv4 } from 'uuid';
import { ref, shallowReactive } from 'vue';
import type { Timeline } from '../Timeline/Timeline';

export abstract class TimelineItem {
    public id = uuidv4();
    public type: TimelineItemType = 'Base';

    public name = ref('');

    public linkedItems = shallowReactive(new Set<TimelineItem>());

    private lastStart = ref(0);
    private lastEnd = ref(0);
    private lastLayer = ref(0);

    public start = ref(0);
    public end = ref(0);
    public layer = ref(0);

    // Might want to change this to BaseTimeline depending on
    // what happens with in terms of other types of timelines
    private timeline!: Timeline;

    /**
     * Whether this timeline item is a ghost.
     *
     * Ghosts are used for when an item is being dragged
     * and shouldn't interact with surrounding items.
     */
    public isGhost = ref(false);

    public onMoveStart() {
        this.isGhost.value = true;
        this.lastStart.value = this.start.value;
        this.lastEnd.value = this.end.value;
        this.lastLayer.value = this.layer.value;

        this.linkedItems.forEach((item) => {
            item.isGhost.value = true;
            item.lastStart.value = item.start.value;
            item.lastEnd.value = item.end.value;
            item.lastLayer.value = item.layer.value;
        });
    }
    /**
     * @param offset Offset in milliseconds
     */
    public onMoveDrag(offset: number) {
        this.start.value += offset;
        this.end.value += offset;

        this.linkedItems.forEach((item) => {
            item.start.value += offset;
            item.end.value += offset;
        });
    }
    public onMoveCancel() {
        this.start.value = this.lastStart.value;
        this.end.value = this.lastEnd.value;
        this.layer.value = this.lastLayer.value;
        this.isGhost.value = false;

        this.linkedItems.forEach((item) => {
            item.start.value = item.lastStart.value;
            item.end.value = item.lastEnd.value;
            item.layer.value = item.lastLayer.value;
            item.isGhost.value = false;
        });
    }
    public onDrop() {
        this.isGhost.value = false;

        this.linkedItems.forEach((item) => {
            item.isGhost.value = false;
        });

        this.linkedItems.forEach(this.timeline.itemDropped);
        this.timeline.itemDropped(this);
    }

    public onDroppedOn(otherItem: TimelineItem) {
        if (otherItem.end.value > this.start.value && otherItem.start.value < this.start.value) {
            // ▼  [====]    < Other item
            // ▼    [=====] < This item
            this.start.value = otherItem.end.value + this.timeline.frameDuration.value;
        } else if (otherItem.start.value < this.end.value && otherItem.end.value > this.end.value) {
            // ▼    [=====] < Other item
            // ▼  [====]    < This item
            this.end.value = otherItem.start.value - this.timeline.frameDuration.value;
        } else if (
            otherItem.start.value <= this.start.value &&
            otherItem.end.value >= this.end.value
        ) {
            // ▼  [======] < Other item
            // ▼   [====]  < This item
            this.timeline.deleteItem(this);
        }
    }

    /**
     * Move this timeline item to a specific millisecond value programmatically
     *
     * Note that this will be able to move linked items out of the range of the timeline.
     *
     * @param time New millisecond time to move to.
     */
    public MoveTo(time: number) {
        this.linkedItems.forEach((item) => {
            // Offset between current item and other item
            const offset = item.start.value - this.start.value;

            const startEndOffset = item.end.value - item.start.value;

            item.start.value = time + offset;
            item.end.value = time + offset + startEndOffset;
            item.isGhost.value = false;
        });

        const startEndOffset = this.end.value - this.start.value;
        this.start.value = time;
        this.end.value = time + startEndOffset;
        this.isGhost.value = false;

        this.timeline.itemDropped(this);
    }

    public Delete() {
        this.linkedItems.forEach((item) => {
            // Delete myself from other linked items
            item.linkedItems.delete(this);
        });
    }
}

export type TimelineItemType = 'Base' | 'Video' | 'Audio' | 'Image' | 'EffectLayer';
