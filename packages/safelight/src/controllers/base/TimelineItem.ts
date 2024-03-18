import Timecode, { type TimecodeRef } from '@safelight/shared/Timecode';
import { v4 as uuidv4 } from 'uuid';
import type AVTimelineItem from '../TimelineItem/AVTimelineItem';
import type BaseTimeline from './Timeline';

export default abstract class BaseTimelineItem {
    public id = uuidv4();
    public layer = 0;
    public abstract type: TimelineItemType;
    public abstract parentTimeline: BaseTimeline;

    public start = Timecode.from(0);
    public end = Timecode.from(0);

    public onMove(newStart: TimecodeRef) {
        this.start = newStart;

        if (this.parentTimeline.isSimpleTimeline()) this.parentTimeline.updateDuration();
    }

    isAudioVideo = (): this is AVTimelineItem => this.type == 'AudioVideo';
}

export type TimelineItemType = 'AudioVideo' | 'EffectLayer';
