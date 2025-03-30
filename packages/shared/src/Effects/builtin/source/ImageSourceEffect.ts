import { MediaSourceType } from '../../../Media/Media';
import type { EffectMeta } from '../../EffectManager';
import { defineSource } from '../../sourceEffect';

export const meta: EffectMeta = {
    name: 'sl:image-source',
    category: 'source'
};

export default function SLImageSource() {
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let decoder: ImageDecoder | undefined;
    return defineSource({
        name: 'sl:image-source',
        async load(media) {
            if (!media?.isMediaFile() || !media.isOfType(MediaSourceType.Image)) return false;

            const file = await media.loadFile();
            if (!file) return false;

            const type = media.getMetadata('file.mimeType');
            decoder = new ImageDecoder({ data: file, type });
            await decoder.tracks.ready;
            return true;
        },
        async source(cfg) {
            if (!decoder) return { ctx };
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const image = await decoder.decode({
                completeFramesOnly: true,
                frameIndex: decoder.tracks.selectedTrack?.animated
                    ? cfg.frame % (decoder.tracks.selectedTrack?.frameCount ?? Infinity)
                    : 0
            });
            const width = image.image.displayWidth;
            const height = image.image.displayHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            ctx.drawImage(image.image, 0, 0);

            image.image.close();

            return {
                ctx,
                width,
                height
            };
        }
    });
}
