import { type MediaItem, MediaSourceType } from '../../../Media/Media';

export function SLChunkedSource(media?: MediaItem) {
    if (!media?.isChunkedMediaFile() || !media.isOfType(MediaSourceType.Video)) return;

    // TODO: Implement once chunking is more developed
}
