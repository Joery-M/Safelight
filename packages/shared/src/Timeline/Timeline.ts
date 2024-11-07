import { useManualRefHistory } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, shallowReactive, watch } from 'vue';
import {
    MediaItem,
    MediaSourceType,
    type MediaItemMetadata,
    type MediaItemTypes
} from '../Media/Media';
import { TimelineItem } from './TimelineItem';

export class Timeline extends MediaItem<TimelineItemMetadata> {
    public id = uuidv4();
    public name = ref('');
    public type: MediaItemTypes = 'Timeline';

    public items = shallowReactive(new Map<string, TimelineItem>());

    public width = ref(1920);
    public height = ref(1080);
    public framerate = ref(60);
    /**
     * Duration of a single frame in milliseconds
     */
    public frameDuration = computed(() => {
        return 1000 / this.framerate.value;
    });

    constructor(config: TimelineConfig, initItems: TimelineItem[] = []) {
        super();
        this.addMetadata('media.sourceType', MediaSourceType.Timeline);

        this.name.value = config.name;
        this.width.value = config.width;
        this.height.value = config.height;
        this.framerate.value = config.framerate;

        this.addMetadata('timelineConfig', config);

        watch([this.framerate, this.height, this.width, this.name], () => {
            this.addMetadata('timelineConfig', {
                framerate: this.framerate.value,
                height: this.height.value,
                width: this.width.value,
                name: this.name.value
            });
            this.save();
        });

        watch(this.items, (items) => {
            this.addMetadata('items', Array.from(items.keys()));
            this.save();
        });

        this.pbPosHistory.commit();

        for (const item of initItems) {
            this.items.set(item.id, item);
        }
    }

    //#region Timeline items

    async createTimelineItem() {
        const item = new TimelineItem(this);
        item.save();
        this.items.set(item.id, item);

        await this.save();

        return item;
    }

    /**
     * Called when an item is dropped in the timeline
     */
    public itemDropped(otherItem: TimelineItem) {
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

    public async deleteItem(item: TimelineItem) {
        item.delete();
        this.items.delete(item.id);
        await this.save();
    }

    //#endregion Timeline items

    //#region Playback

    public isPlaying = ref(false);
    /**
     * Current playback position in frames
     */
    public pbPos = ref(0);
    public pbPosHistory = useManualRefHistory(this.pbPos, { capacity: 100 });
    public totalSkippedFrames = ref(0);
    private lastStepTime: number | undefined = undefined;

    public startPlayback(startFrame?: number) {
        if (startFrame !== undefined) {
            this.pbPos.value = startFrame;
            this.pbPosHistory.commit();
        }
        this.totalSkippedFrames.value = 0;
        this.isPlaying.value = true;
        this.stepPlayback();
    }

    public stepPlayback(backwards = false) {
        const timeNow = performance.now();
        // Calculate step, whilst removing excess decimals to prevent floating point inaccuracy
        const step = Math.round(
            Math.trunc(
                (timeNow - (this.lastStepTime ?? timeNow - this.frameDuration.value)) * 1000
            ) / Math.trunc(this.frameDuration.value * 1000)
        );
        // If step is too small, it means were too early
        if (step < 1) {
            requestAnimationFrame(() => this.stepPlayback());
            return;
        }
        // If step is too large it means were too late (skipping frames)
        if (step > 1) {
            this.totalSkippedFrames.value += step - 1;
            console.log(`Skipped ${step - 1} frame${step > 2 ? 's' : ''}`);
        }
        this.pbPos.value += backwards ? -step : step;
        if (this.pbPos.value < 0) {
            this.pbPos.value = 0;
        }

        if (this.isPlaying.value) {
            this.lastStepTime = timeNow;

            requestAnimationFrame(() => this.stepPlayback());
        } else {
            this.pbPosHistory.commit();
            this.lastStepTime = undefined;
        }
    }

    public stopPlayback(cancel = false) {
        this.isPlaying.value = false;
        if (cancel) {
            this.pbPos.value = this.pbPosHistory.last.value.snapshot;
            this.pbPosHistory.undo();
        } else {
            this.pbPosHistory.commit();
        }
    }

    //#endregion
}

export interface TimelineConfig {
    name: string;
    width: number;
    height: number;
    framerate: number;
}

export interface TimelineItemMetadata extends MediaItemMetadata {
    timelineConfig: TimelineConfig;
    items: string[];
}
