import type { UnwrapRef } from 'vue';
import type Media from '../Media/Media';
import type SimpleTimeline from '../Timeline/SimpleTimeline';
import type { TimelineItemType } from '../base/TimelineItem';

const project = useProject();
export default class AVTimelineItem extends TimelineItem {
    public type: TimelineItemType = 'AudioVideo';
    public media = ref<UnwrapRef<Media>>();

    constructor(public parentTimeline: SimpleTimeline) {
        super();
    }

    public LoadMedia(mediaId: string) {
        this.media = project.getMediaFromID(mediaId)!;
    }

    public RenderVideoFrame() {}
}
