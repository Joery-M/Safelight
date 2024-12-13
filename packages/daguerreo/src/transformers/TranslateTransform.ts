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

export function GenericTransform() {
    return defineEffect({
        name: 'dg-transform',
        properties: {
            x: dgNumberProperty(0),
            y: dgNumberProperty(0),
            scaleX: dgNumberProperty(1, {
                transform: { toDisplay: (v) => v * 100, toValue: (v) => v / 100 }
            }),
            scaleY: dgNumberProperty(1, {
                transform: { toDisplay: (v) => v * 100, toValue: (v) => v / 100 }
            }),
            originX: dgNumberProperty(1, {
                transform: { toDisplay: (v) => v * 100, toValue: (v) => v / 100 }
            }),
            originY: dgNumberProperty(1, {
                transform: { toDisplay: (v) => v * 100, toValue: (v) => v / 100 }
            }),
            rotation: dgNumberProperty(0, {
                transform: { toValue: (v) => (v < 0 ? v + 360 : v % 360) }
            }),
            opacity: dgNumberProperty(1, {
                integerOnly: true,
                min: 0,
                max: 100,
                slider: true,
                transform: { toDisplay: (v) => v * 100, toValue: (v) => v / 100 }
            })
        },
        transform({ matrix, properties, width, height, opacity }) {
            if (properties.x !== 0 || properties.y !== 0) {
                matrix.translateSelf(properties.x, properties.y);
            }
            if (properties.scaleX !== 1 || properties.scaleY !== 1) {
                matrix.scaleSelf(properties.scaleX, properties.scaleY, 1, width / 2, height / 2);
            }
            if (properties.rotation !== 0) {
                matrix
                    .translateSelf(width / 2, height / 2)
                    .rotateSelf(properties.rotation)
                    .translateSelf(width / -2, height / -2);
            }

            return {
                matrix,
                opacity: opacity * properties.opacity
            };
        }
    });
}
