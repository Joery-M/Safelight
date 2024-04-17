import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import type SimpleTimeline from '../Timeline/SimpleTimeline';
import type AudioTimelineItem from '../TimelineItem/AudioTimelineItem';
import type VideoTimelineItem from '../TimelineItem/VideoTimelineItem';

export default abstract class BaseTimelineItem {
    public id = uuidv4();
    public type: TimelineItemType = 'Base';

    public name = ref('');

    private lastStart = ref(0);
    private lastEnd = ref(0);
    private lastLayer = ref(0);

    public start = ref(0);
    public end = ref(0);
    public layer = ref(0);

    // Might want to change this to BaseTimeline depending on
    // what happens with in terms of other types of timelines
    private timeline!: SimpleTimeline;

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
    }
    /**
     * @param offset Offset in milliseconds
     */
    public onMoveDrag(offset: number) {
        this.start.value += offset;
    }
    public onMoveCancel() {
        this.start.value = this.lastStart.value;
        this.end.value = this.lastEnd.value;
        this.layer.value = this.lastLayer.value;
        this.isGhost.value = false;
    }
    public onDrop() {
        this.isGhost.value = false;

        this.timeline.itemDropped(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onDroppedOn(otherItem: BaseTimelineItem) {
        // TODO: Implement behavior for when an item is dropped on the current item
    }

    /**
     * Move this timeline item to a specific millisecond value programmatically
     *
     * @param time New millisecond time to move to.
     */
    public MoveTo(time: number) {
        this.start.value = time;
        this.isGhost.value = false;
        this.timeline.itemDropped(this);
    }

    isBaseTimelineItem = (): this is BaseTimelineItem => this.type === 'Base';
    isVideo = (): this is VideoTimelineItem => this.type === 'Video';
    // Implement
    isAudio = (): this is AudioTimelineItem => this.type === 'Audio';
    // Implement
    isImage = (): this is AudioTimelineItem => this.type === 'Image';
}

export type TimelineItemType = 'Base' | 'Video' | 'Audio' | 'Image' | 'EffectLayer';
