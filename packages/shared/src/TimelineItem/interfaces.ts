import type { ShallowRef } from 'vue';
import type Media from '../Media/Media';

export interface TimelineItemMedia {
    media: ShallowRef<Media | undefined>;
    hasMedia: () => this is TimelineItemMedia;
}
