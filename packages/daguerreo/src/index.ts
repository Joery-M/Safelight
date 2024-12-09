import type { Promisable } from 'type-fest';
import type { DGTransformProperties } from './properties';
import type { DaguerreoTransformEffect, DaguerreoTransformPayload } from './transformEffect';

export class Daguerreo {
    private source: DaguerreoSourceEffect | undefined;
    readonly effects: DaguerreoTransformEffect[] = [];

    addEffect(effect: DaguerreoTransformEffect) {
        this.effects.push(effect);
    }
    removeEffect(effect: DaguerreoTransformEffect) {
        this.effects.slice(this.effects.indexOf(effect) - 1, 1);
    }
    setSource(source: DaguerreoSourceEffect) {
        this.source = source;
    }

    getAllTransformDefaults() {
        const allProps: DGTransformProperties[] = [];
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];

            const props: DGTransformProperties = {};
            if (effect.properties) {
                for (const key in effect.properties) {
                    if (key in effect.properties) {
                        const prop = effect.properties[key];
                        props[key] = prop.value();
                    }
                }
            }

            allProps[i] = props;
        }

        return allProps;
    }

    async process(
        config: DaguerreoSourcePayload,
        transformProps: DGTransformProperties[] = this.getAllTransformDefaults()
    ): Promise<DaguerreoResult> {
        const effectBase = this.source;
        if (!effectBase) throw new Error('No source effect defined');

        await effectBase.load?.();

        const payload = await effectBase.source(config);

        // Run initialize methods
        const initFunctions = this.effects
            .map((e) => e.sourceInitialized?.({ height: payload.height, width: payload.width }))
            .filter((p) => !!p);
        await Promise.allSettled(initFunctions);

        // Run effects
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];

            const props: DGTransformProperties = transformProps[i] ?? {};
            if (effect.properties) {
                for (const key in effect.properties) {
                    if (key in effect.properties && !(key in props)) {
                        const prop = effect.properties[key];
                        props[key] = prop.value();
                    }
                }
            }
            await effect.transform({ ...payload, properties: props });
        }

        return {
            width: payload.width,
            height: payload.height,
            image: payload.ctx.canvas.transferToImageBitmap(),
            matrix: payload.matrix,
            alpha: 1,
            compositeOperation: 'source-over'
        } as DaguerreoResult;
    }
}

export interface DaguerreoSourceEffect {
    name: string;
    load?: () => Promisable<void>;
    source: (config: DaguerreoSourcePayload) => Promisable<DaguerreoTransformPayload>;
}

export type DaguerreoEffect = DaguerreoSourceEffect | DaguerreoTransformEffect;

export interface DaguerreoSourcePayload {
    /**
     * Current frame number
     */
    frame: number;
    /**
     * Frame duration in milliseconds.
     */
    frameDuration: number;
    /**
     * Timeline width
     */
    width: number;
    /**
     * Timeline height
     */
    height: number;
}

export interface DaguerreoResult {
    /**
     * Current frame width
     */
    width: number;
    /**
     * Current frame height
     */
    height: number;

    image: ImageBitmap;

    matrix: DOMMatrix;

    compositeOperation: GlobalCompositeOperation;

    alpha: number;
}

export * from './properties';
export * from './transformEffect';
