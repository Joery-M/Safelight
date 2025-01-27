import { MediaSourceType, type MediaItem } from '../../../Media/Media';
import { defineSource } from '../../sourceEffect';

export function SLImageSource(media?: MediaItem) {
    if (!media?.isMediaFile() || !media.isOfType(MediaSourceType.Image)) return;

    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let decoder: ImageDecoder | undefined;
    const type = media.getMetadata('file.mimeType');
    return defineSource({
        name: 'sl:image-source',
        async load() {
            const file = await media.loadFile();
            if (!file) return;

            decoder = new ImageDecoder({ data: file, type });
            await decoder.tracks.ready;
        },
        async source(cfg) {
            if (!decoder) return { ctx };

            const image = await decoder.decode({
                completeFramesOnly: true,
                frameIndex: decoder.tracks.selectedTrack?.animated
                    ? cfg.frame % (decoder.tracks.selectedTrack?.frameCount ?? Infinity)
                    : 0
            });
            if (image.image) {
                if (
                    canvas.width !== image.image.displayWidth ||
                    canvas.height !== image.image.displayHeight
                ) {
                    canvas.width = image.image.displayWidth;
                    canvas.height = image.image.displayHeight;
                }

                ctx.drawImage(image?.image, 0, 0);
                image.image.close();
            }
            return {
                ctx
            };
        }
    });
}
