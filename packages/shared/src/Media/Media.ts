import type { DateTime } from 'luxon';
import { type MediaInfoType } from 'mediainfo.js';
import { ref } from 'vue';
import MissingThumbnailUrl from '../../assets/missing_thumbnail.png?url';
import type { MaybePromiseResult } from '../../types/MaybePromise';
import type BaseTimelineItem from '../base/TimelineItem';
import VideoTimelineItem from '../TimelineItem/VideoTimelineItem';

// Not sure if refs are needed here, might want to look at this in the future.

export default class Media {
    public id!: string;
    public name = ref('Untitled Media');
    /**
     * @description Type of this media file
     */
    public type: MediaType = 0;
    /**
     * @description Data URI for this files' preview image.
     *
     * Defaults to Missing thumbnail:
     *
     * ![Missing thumbnail](../../assets/missing_thumbnail.png "A")
     */
    public previewImage = ref<string>(MissingThumbnailUrl);
    public loaded = ref(false);
    public contentHash!: string;

    public file!: Blob;
    public created!: DateTime<true>;

    /**
     * @description The duration of this media item. By default it is set to 5 seconds, which will apply to images
     * @default 5000
     */
    public duration = ref(5000);
    /**
     * Media info generated from mediainfo.js.
     *
     * If possible, don't use this data directly, use track info instead.
     */
    public fileInfo!: MediaInfoType;

    videoTracks: VideoTrackInfo[] = [];
    audioTracks: AudioTrackInfo[] = [];
    imageInfo?: ImageInfo;
    textTracks: TextTrackInfo[] = [];

    /**
     * Check whether this media is of a type, or multiple.
     */
    isOfType(...type: MediaType[]) {
        let totalType = 0;

        type.forEach((t) => (totalType = totalType | t));

        return (this.type & totalType) == totalType;
    }

    static timelineItemCreators: MediaToTimelineItemFunc[] = [mediaToVideoTimelineItem];

    async createTimelineItem<T extends BaseTimelineItem>(): Promise<T[] | undefined> {
        const results = await Promise.all(Media.timelineItemCreators.map((f) => f(this)));
        return results.filter((i) => i !== undefined).flat(1) as T[];
    }
}

function mediaToVideoTimelineItem(media: Media) {
    if (media.isOfType(MediaType.Video)) {
        return media.videoTracks.map((track, i) => {
            const tItem = new VideoTimelineItem();
            tItem.media.value = media;
            tItem.trackInfo.value = track;
            // TODO: get sleep and implement difference between audio timeline items and video timeline items
            tItem.layer.value = i - 1;
            tItem.duration.value = track.duration;
            return tItem;
        });
    }
}

export enum MediaType {
    Unknown = 0,
    /**
     * Media contains audio
     */
    Audio = 1 << 0,
    /**
     * Media contains video
     */
    Video = 1 << 1,
    /**
     * Media is a static image
     */
    Image = 1 << 2,
    /**
     * Media contains a text stream, like subtitles.
     */
    Text = 1 << 3
}

export interface VideoTrackInfo {
    codec: string;
    width: number;
    height: number;
    frameRate: number;
    frameRateMode: 'CFR' | 'VFR';
    bitDepth: number;
    colorSpace: string;
    isHDR: boolean;
    title: string;
    duration: number;
}

export interface AudioTrackInfo {
    codec: string;
    sampleRate: number;
    channels: number;
    title?: string;
    duration: number;
}

export interface ImageInfo {
    format: string;
    width: number;
    height: number;
}

export interface TextTrackInfo {
    format: string;
}

export type MediaToTimelineItemFunc = (
    media: Media
) => MaybePromiseResult<BaseTimelineItem[] | undefined>;
