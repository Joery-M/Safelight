import type { DaguerreoSourceEffect, DaguerreoStreamPayload } from '..';

export function GradientTestSource() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;
    let counter = 0;

    let rafHandle: number | undefined;
    const streamSource = new ReadableStream<DaguerreoStreamPayload>({
        start(controller) {
            const render = () => {
                ctx.clearRect(0, 0, 1280, 720);

                const val = Math.sqrt(1280 ** 2 + 720 ** 2);

                const gradient = ctx.createLinearGradient(0, 0, 1280, 0);

                gradient.addColorStop(0, `hsl(${counter % 360}, 100%, 50%)`);
                gradient.addColorStop(0.5, `hsl(${(counter % 360) + 180}, 100%, 50%)`);
                gradient.addColorStop(1, `hsl(${counter % 360}, 100%, 50%)`);

                ctx.fillStyle = gradient;

                const matrix = ctx
                    .getTransform()
                    .translate(1280 / 2, 720 / 2)
                    .rotate(counter % 360)
                    .translate(1280 / -2, 720 / -2);

                ctx.setTransform(matrix);
                // idk man, math shit
                ctx.fillRect((val - 1280) / -2, (val - 720) / -2, val, val);
                ctx.resetTransform();

                ctx.fillStyle = 'white';
                ctx.font = '84px Arial';
                ctx.fillText(Math.floor((counter / 10) % 100).toString(), 20, 75);

                controller.enqueue({
                    data: ctx.getImageData(0, 0, 1280, 720)
                });

                counter++;
                rafHandle = requestAnimationFrame(render);
            };
            rafHandle = requestAnimationFrame(render);
        },
        cancel() {
            if (rafHandle !== undefined) cancelAnimationFrame(rafHandle);
            canvas.remove();
        }
    });

    return {
        name: 'gradient-test-source',
        type: 'source',
        source: streamSource
    } as DaguerreoSourceEffect;
}

export function CatTestSource() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;

    let catImage: HTMLImageElement;

    import('../assets/cat.avif').then((d) => {
        const img = document.createElement('img');
        img.src = d.default;
        img.addEventListener('load', () => {
            catImage = img;
        });
    });

    let rafHandle: number | undefined;
    const streamSource = new ReadableStream<DaguerreoStreamPayload>({
        start(controller) {
            const render = () => {
                ctx.clearRect(0, 0, 1280, 720);

                if (catImage) ctx.drawImage(catImage, 0, 0);

                controller.enqueue({
                    data: ctx.getImageData(0, 0, 1280, 720)
                });

                rafHandle = requestAnimationFrame(render);
            };
            rafHandle = requestAnimationFrame(render);
        },
        cancel() {
            if (rafHandle !== undefined) cancelAnimationFrame(rafHandle);
            canvas.remove();
            catImage?.remove();
        }
    });

    return {
        name: 'cat-test-source',
        type: 'source',
        source: streamSource
    } as DaguerreoSourceEffect;
}
