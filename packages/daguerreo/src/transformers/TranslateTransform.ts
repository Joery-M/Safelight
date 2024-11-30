import { defineEffect } from '..';
import { dgNumberProperty } from '../properties';

export function TranslateTransform() {
    return defineEffect({
        name: 'dg-translate-transform',
        properties: {
            distance: dgNumberProperty(20),
            speed: dgNumberProperty(30)
        },
        transform: ({ frame, matrix, properties }) => {
            const distance = properties.distance * 10;
            matrix.translateSelf(
                Math.sin(frame / properties.speed) * distance,
                Math.cos(frame / properties.speed) * distance
            );
        }
    });
}

export function RotateTransform() {
    return defineEffect({
        name: 'dg-rotate-transform',
        transform: ({ ctx, frame, matrix }) => {
            matrix.translateSelf(ctx.canvas.width / 2, ctx.canvas.height / 2);
            matrix.rotateSelf(frame);
            matrix.translateSelf(ctx.canvas.width / -2, ctx.canvas.height / -2);
        }
    });
}

export function ScaleTransform() {
    return defineEffect({
        name: 'dg-scale-transform',
        transform: ({ ctx, frame, matrix }) => {
            matrix.translateSelf(ctx.canvas.width / 2, ctx.canvas.height / 2);
            matrix.scaleSelf(1 - (Math.sin(frame / 30) + 1) / 5);
            matrix.translateSelf(ctx.canvas.width / -2, ctx.canvas.height / -2);
        }
    });
}

export function FlipTransform() {
    return defineEffect({
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
    });
}
