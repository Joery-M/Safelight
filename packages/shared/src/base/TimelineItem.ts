import type AudioTimelineItem from '@/TimelineItem/AudioTimelineItem';
import type VideoTimelineItem from '@/TimelineItem/VideoTimelineItem';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

export default abstract class BaseTimelineItem {
    public id = uuidv4();
    public layer = 0;
    public type: TimelineItemType = 'Base';

    public start = ref(0);
    public end = ref(0);

    public onMove(newStart: number) {
        this.start.value = newStart;
    }

    isBaseTimelineItem = (): this is BaseTimelineItem => this.type === 'Base';
    isVideo = (): this is VideoTimelineItem => this.type === 'Video';
    isAudio = (): this is AudioTimelineItem => this.type === 'Audio';
}

export type TimelineItemType = 'Base' | 'Video' | 'Audio' | 'EffectLayer';
