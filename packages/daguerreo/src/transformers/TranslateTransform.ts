import type { DaguerreoTransformEffect } from '..';

export function TranslateTransform() {
    return {
        name: 'dg-translate-transform',
        transform: ({ frame, matrix }) => {
            matrix.translateSelf(Math.sin(frame / 30) * 200, Math.cos(frame / 30) * 200);
        }
    } as DaguerreoTransformEffect;
}

export function RotateTransform() {
    return {
        name: 'dg-rotate-transform',
        transform: ({ ctx, frame, matrix }) => {
            matrix.translateSelf(ctx.canvas.width / 2, ctx.canvas.height / 2);
            matrix.rotateSelf(frame);
            matrix.translateSelf(ctx.canvas.width / -2, ctx.canvas.height / -2);
        }
    } as DaguerreoTransformEffect;
}

export function ScaleTransform() {
    return {
        name: 'dg-scale-transform',
        transform: ({ ctx, frame, matrix }) => {
            matrix.translateSelf(ctx.canvas.width / 2, ctx.canvas.height / 2);
            matrix.scaleSelf(1 - (Math.sin(frame / 30) + 1) / 5);
            matrix.translateSelf(ctx.canvas.width / -2, ctx.canvas.height / -2);
        }
    } as DaguerreoTransformEffect;
}

export function FlipTransform() {
    return {
        name: 'dg-flip-transform',
        transform: ({ ctx, frame, matrix }) => {
            matrix.translateSelf(ctx.canvas.width / 2, ctx.canvas.height / 2);
            const scaleY = Math.sin(frame / 30);
            matrix.scaleSelf(1, scaleY);
            if (scaleY < 0) {
                ctx.fillStyle = '#000000D0';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
            matrix.translateSelf(ctx.canvas.width / -2, ctx.canvas.height / -2);
        }
    } as DaguerreoTransformEffect;
}
