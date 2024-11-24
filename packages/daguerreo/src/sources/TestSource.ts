import type { DaguerreoSourceEffect } from '..';
import { parseGIF, decompressFrames, type ParsedFrame } from 'gifuct-js';

export function GradientTestSource() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;

    return {
        name: 'gradient-test-source',
        type: 'source',
        source: ({ frame }) => {
            ctx.clearRect(0, 0, 1280, 720);

            const val = Math.sqrt(1280 ** 2 + 720 ** 2);

            const gradient = ctx.createLinearGradient(0, 0, 1280, 0);

            gradient.addColorStop(0, `hsl(${frame % 360}, 100%, 50%)`);
            gradient.addColorStop(0.5, `hsl(${(frame % 360) + 180}, 100%, 50%)`);
            gradient.addColorStop(1, `hsl(${frame % 360}, 100%, 50%)`);

            ctx.fillStyle = gradient;

            const matrix = ctx
                .getTransform()
                .translate(1280 / 2, 720 / 2)
                .rotate(frame % 360)
                .translate(1280 / -2, 720 / -2);

            ctx.setTransform(matrix);
            // idk man, math shit
            ctx.fillRect((val - 1280) / -2, (val - 720) / -2, val, val);
            ctx.resetTransform();

            ctx.fillStyle = 'white';
            ctx.font = '84px Arial';
            ctx.fillText(Math.floor((frame / 10) % 100).toString(), 20, 75);

            return {
                data: ctx.getImageData(0, 0, 1280, 720),
                frameDuration: 1 / 60,
                height: 720,
                width: 1280
            };
        }
    } as DaguerreoSourceEffect;
}

export function CatTestSource() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;

    let catImage: HTMLImageElement;

    return {
        name: 'cat-test-source',
        type: 'source',
        source: async () => {
            ctx.clearRect(0, 0, 1280, 720);

            if (catImage) {
                ctx.drawImage(catImage, 0, 0);
            } else {
                const d = await import('../assets/cat.avif');
                const img = document.createElement('img');
                img.src = d.default;

                await new Promise<void>((resolve, reject) => {
                    img.addEventListener('load', () => {
                        catImage = img;
                        ctx.drawImage(catImage, 0, 0);
                        resolve();
                    });
                    setTimeout(() => {
                        reject('Timeout');
                    }, 10_000);
                });
            }

            return {
                data: ctx.getImageData(0, 0, 1280, 720),
                frameDuration: 1 / 60,
                width: 1280,
                height: 720
            };
        }
    } as DaguerreoSourceEffect;
}

export function GifTestSource() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;

    const frames: ParsedFrame[] = [];
    let gifLength = 0;

    import('../assets/fish-fish-eating.gif?url').then(async ({ default: url }) => {
        const arrayBuffer = await fetch(url).then((r) => r.arrayBuffer());

        const gif = parseGIF(arrayBuffer);
        console.log(gif);
        frames.push(...decompressFrames(gif, true));
        gifLength = frames.reduce((l, f) => l + f.delay, 0);

        canvas.width = Math.max(...frames.map(({ dims: { width } }) => width));
        canvas.height = Math.max(...frames.map(({ dims: { height } }) => height));
    });

    let frameImageData: ImageData | undefined;

    return {
        name: 'gif-test-source',
        type: 'source',
        source: async ({ frame, frameDuration }) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const curTime = (frame * frameDuration) % gifLength;

            if (frames.length > 0) {
                let d = 0;
                const frame = frames.find((f) => {
                    d += f.delay;
                    return d >= curTime;
                });
                if (!frame) {
                    return {
                        data: ctx.getImageData(0, 0, canvas.width, canvas.height),
                        frameDuration: 1 / 60,
                        width: canvas.width,
                        height: canvas.height
                    };
                }

                const dims = frame.dims;

                if (
                    !frameImageData ||
                    dims.width != frameImageData.width ||
                    dims.height != frameImageData.height
                ) {
                    canvas.width = dims.width;
                    canvas.height = dims.height;
                    frameImageData = ctx.createImageData(dims.width, dims.height);
                }

                // set the patch data as an override
                frameImageData.data.set(frame.patch);

                // draw the patch back over the canvas
                ctx.putImageData(frameImageData, 0, 0);
            }

            return {
                data: ctx.getImageData(0, 0, canvas.width, canvas.height),
                frameDuration: 1 / 60,
                width: canvas.width,
                height: canvas.height
            };
        }
    } as DaguerreoSourceEffect;
}
