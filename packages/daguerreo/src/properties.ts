const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
    lerp(x2, y2, invlerp(x1, y1, a));

export function dgNumberProperty(value: number): DGTransformProperty<number> {
    const keyframes: DGKeyframe[] = [];

    return {
        type: 'number',
        value(frame: number) {
            if (keyframes.length === 0) {
                return value;
            } else if (keyframes.length === 1) {
                return keyframes[0].value;
            }

            const v1i = keyframes.findIndex((k) => k.frame >= frame);
            if (v1i < 0) return keyframes.at(-1)!.value;
            if (v1i == 0) return keyframes[0].value;

            const v1 = keyframes[v1i - 1];
            const v2 = keyframes[v1i];
            if (!v2) return v1.value;

            const t = range(v1.frame, v2.frame, 0, 1, frame);

            if (v1.interpolation) {
                const t2 = v1.interpolation(t);
                if (t2 !== undefined) {
                    return lerp(v1.value, v2.value, t2);
                }
            }
            return lerp(v1.value, v2.value, t);
        },

        canHaveInterpolation: true,
        canHaveKeyframes: true,

        setKeyframe(frame, value, fn) {
            this.removeKeyframe(frame);

            keyframes.push({ frame, value, interpolation: fn });
            keyframes.sort(({ frame: frameA }, { frame: frameB }) => frameA - frameB);
        },
        removeKeyframe(frameNum) {
            const i = keyframes.findIndex(({ frame }) => frame === frameNum);
            if (i < 0) return false;

            keyframes.splice(i, 1);
            return true;
        }
    };
}

export type DGInterpolationFn = (t: number) => number;
export interface DGKeyframe {
    frame: number;
    value: number;
    interpolation: DGInterpolationFn | undefined;
}

export type DGPropertyTypes = 'number';

export type DGTransformProperty<T = any> = {
    type: DGPropertyTypes;
    value(frame: number): T;
} & (
    | {
          canHaveKeyframes: true;

          removeKeyframe(frame: number): boolean;
      }
    | { canHaveKeyframes: false }
) &
    (
        | {
              canHaveInterpolation: true;

              setKeyframe(frame: number, value: T, fn?: DGInterpolationFn): void;
          }
        | {
              canHaveInterpolation: false;

              setKeyframe(frame: number, value: T): void;
          }
    );

export interface DGTransformProperties {
    [key: string]: DGTransformProperty;
}
export type DGComputedProperties<P extends DGTransformProperties> = {
    [K in keyof P]: ReturnType<P[K]['value']>;
};
