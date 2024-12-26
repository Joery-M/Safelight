import { decompressFrames, parseGIF, type ParsedFrame } from 'gifuct-js';
import type { DaguerreoSourceEffect } from '..';

export function GradientTestSource() {
    const canvas = new OffscreenCanvas(1280, 720);
    const ctx = canvas.getContext('2d')!;

    return {
        name: 'gradient-test-source',
        source: ({ frame, width, height }) => {
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
            ctx.reset();

            // Never thought the day would come
            const diagonal = Math.sqrt(width ** 2 + height ** 2);

            const gradient = ctx.createLinearGradient(0, 0, width, 0);

            gradient.addColorStop(0, `hsl(${frame % 360}, 100%, 50%)`);
            gradient.addColorStop(0.5, `hsl(${(frame % 360) + 180}, 100%, 50%)`);
            gradient.addColorStop(1, `hsl(${frame % 360}, 100%, 50%)`);

            ctx.fillStyle = gradient;

            const matrix = ctx
                .getTransform()
                .translate(width / 2, height / 2)
                .rotate(frame % 360)
                .translate(width / -2, height / -2);

            ctx.setTransform(matrix);
            // idk man, math shit
            ctx.fillRect((diagonal - width) / -2, (diagonal - height) / -2, diagonal, diagonal);
            ctx.resetTransform();

            ctx.fillStyle = 'white';
            ctx.font = '84px Arial';
            ctx.fillText(Math.floor((frame / 10) % 100).toString(), 20, 75);

            return {
                ctx
            };
        }
    } as DaguerreoSourceEffect;
}

export function CatTestSource() {
    const canvas = new OffscreenCanvas(1280, 720);
    const ctx = canvas.getContext('2d')!;

    let catImage: HTMLImageElement;

    return {
        name: 'cat-test-source',
        async source() {
            ctx.reset();

            if (catImage) {
                ctx.drawImage(catImage, 0, 0);
            } else {
                const d = await import('../assets/cat.avif');
                const img = document.createElement('img');
                img.src = d.default;

                await new Promise<void>((resolve, reject) => {
                    img.addEventListener('load', () => {
                        catImage = img;
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(catImage, 0, 0);
                        resolve();
                    });
                    setTimeout(() => {
                        reject('Timeout');
                    }, 10_000);
                });
            }

            return {
                ctx,
                width: catImage.width,
                height: catImage.height
            };
        }
    } as DaguerreoSourceEffect;
}

export function GifTestSource() {
    const canvas = new OffscreenCanvas(1280, 720);
    const ctx = canvas.getContext('2d')!;

    const frames: ParsedFrame[] = [];
    let gifLength = 0;
    let frameTime = 1;

    let frameImageData: ImageData | undefined;

    return {
        name: 'gif-test-source',
        async load() {
            const { default: url } = await import('../assets/fish-fish-eating.gif?url');
            const arrayBuffer = await fetch(url).then((r) => r.arrayBuffer());

            const gif = parseGIF(arrayBuffer);
            frames.push(...decompressFrames(gif, true));
            gifLength = frames.reduce((l, f) => l + f.delay, 0);
            frameTime = gifLength / frames.length;

            canvas.width = Math.max(...frames.map(({ dims: { width } }) => width));
            canvas.height = Math.max(...frames.map(({ dims: { height } }) => height));
        },
        source: async ({ frame, frameDuration }) => {
            ctx.reset();
            const curTime = (frame * frameDuration) % gifLength;

            if (frames.length > 0) {
                let d = 0;
                const frame = frames.find((f) => {
                    d += f.delay;
                    return d >= curTime;
                });
                if (!frame) {
                    return {
                        ctx,
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
                ctx,
                frameDuration: 1000 / frameTime,
                width: canvas.width,
                height: canvas.height
            };
        }
    } as DaguerreoSourceEffect;
}
