import { Daguerreo, defineSource } from '..';
import { showResult } from './helpers';

test('defineSource', { repeats: 10 }, async () => {
    const color = hsl2rgb(Math.floor(Math.random() * 360), Math.random(), Math.random());
    const canvas = new OffscreenCanvas(0, 0);
    const ctx = canvas.getContext('2d')!;
    const mySource = defineSource({
        name: 'test-source',
        source({ width, height }) {
            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = 'rgb(' + color.join(',') + ')';
            ctx.fillRect(0, 0, width, height);

            return {
                ctx
            };
        }
    });

    const dg = new Daguerreo();

    dg.setSource(mySource);

    const result = await dg.process({
        frame: 0,
        frameDuration: 1 / 60,
        width: 50,
        height: 50,
        quality: 'final'
    });

    const resultCanvas = showResult(result.image);
    const pixelColor = resultCanvas.getImageData(0, 0, 1, 1).data.slice(0, 3);
    expect(color).toMatchObject(pixelColor);
});

function hsl2rgb(h: number, s: number, l: number) {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number, k = (n + h / 30) % 12) =>
        Math.floor((l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) * 255);
    return [f(0), f(8), f(4)];
}
