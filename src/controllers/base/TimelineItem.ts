import { v4 as uuidv4 } from 'uuid';
import Media from '../Media/Media';
import Timecode from '@/helpers/Timecode';
import type AVTimelineItem from '../TimelineItem/AVTimelineItem';
import type BaseTimeline from './Timeline';
import type { UnwrapNestedRefs } from 'vue';

export default abstract class BaseTimelineItem {
    public id = uuidv4();
    public media = ref<Media>();
    public layer = 0;
    public abstract type: TimelineItemType;
    public abstract parentTimeline: BaseTimeline;

    public start = new Timecode(0);
    public end = ref(new Timecode(0));

    public async load(mediaId: string) {
        useProject().getMediaFromID(mediaId)
        this.media.value = media;
        if (!media.duration.value) {
            console.log(media.duration);
            watchOnce(media.duration, () => {
                this.end.value = new Timecode(media.duration.value);
            });
        } else {
            console.log(media.duration.value);
            this.end.value = new Timecode(media.duration.value);
        }
    }

    public onMove(newStart: Timecode) {
        this.start = newStart;

        if (this.parentTimeline.isSimpleTimeline()) this.parentTimeline.updateDuration();
    }

    isAudioVideo = (): this is AVTimelineItem => this.type == 'AudioVideo';
}

export type TimelineItemType = 'AudioVideo' | 'EffectLayer';
