import { v4 as uuidv4 } from 'uuid';
import Media from '../Media/Media';
import Timecode from '@/helpers/Timecode';
import type AVTimelineItem from '../TimelineItem/AVTimelineItem';
import type BaseTimeline from './Timeline';

export default abstract class BaseTimelineItem {
    public id = uuidv4();
    public media = reactive<Media[]>([]);
    public layer = 0;
    public abstract type: TimelineItemType;
    public abstract parentTimeline: BaseTimeline;

    public start = new Timecode(0);
    public end = new Timecode(0);

    public async load(media: Media) {
        this.media.push(media);
    }

    public onMove(newStart: Timecode) {
        this.start = newStart;

        if (this.parentTimeline.isSimpleTimeline()) this.parentTimeline.updateDuration();
    }

    isAudioVideo = (): this is AVTimelineItem => this.type == 'AudioVideo';
}

export type TimelineItemType = 'AudioVideo' | 'EffectLayer';
