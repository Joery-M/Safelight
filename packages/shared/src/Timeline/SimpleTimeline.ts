import { useManualRefHistory } from '@vueuse/core';
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

        this.pbPosHistory.commit();
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

    //#region Playback

    public isPlaying = ref(false);
    public pbPos = ref(0);
    public pbPosHistory = useManualRefHistory(this.pbPos, { capacity: 100 });
    public totalSkippedFrames = ref(0);
    private lastStepTime: number | undefined = undefined;

    public startPlayback(startTime?: number) {
        if (startTime !== undefined) {
            this.pbPos.value = startTime;
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
        this.pbPos.value += this.frameDuration.value * (backwards ? -step : step);
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

export interface SimpleTimelineConfig {
    name?: string;
    width: number;
    height: number;
    framerate: number;
}
