import type { EffectMeta } from '../../EffectManager';
import { defineSource } from '../../sourceEffect';

export const meta: EffectMeta = {
    name: 'sl:chunked-source',
    category: 'source'
};

export default function SLChunkedSource() {
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // TODO: Implement once chunking is more developed
    return defineSource({
        name: 'sl:chunked-source',
        load(media) {
            if (!media?.isChunkedMediaFile()) return false;
            return true;
        },
        source(_config) {
            return { ctx };
        }
    });
}
