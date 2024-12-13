import type { DGTransformProperties, DGTransformProperty } from './properties';
import type { DaguerreoSourceEffect, DaguerreoSourcePayload } from './sourceEffect';
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

    getTransformProps() {
        const allProps: DGTransformProperties[] = [];
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];

            const props: DGTransformProperties = {};
            if (effect.properties) {
                for (const key in effect.properties) {
                    if (key in effect.properties) {
                        const prop = effect.properties[key] as DGTransformProperty;
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
        transformProps: DGTransformProperties[] = this.getTransformProps()
    ): Promise<DaguerreoResult> {
        const effectBase = this.source;
        if (!effectBase) throw new Error('No source effect defined');

        await effectBase.load?.();

        const payload: DaguerreoTransformPayload = Object.assign(
            // Default values
            {
                matrix: new DOMMatrix(),
                compositeOperation: 'source-over',
                opacity: 1,
                frame: config.frame,
                frameDuration: config.frameDuration,
                width: config.width,
                height: config.height
            },
            await effectBase.source(config)
        );

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
            const result = await effect.transform({ ...payload, properties: props });
            // Assign props
            if (result) Object.assign(payload, result);
        }

        return {
            width: payload.width,
            height: payload.height,
            image: payload.ctx.canvas.transferToImageBitmap(),
            matrix: payload.matrix,
            opacity: payload.opacity,
            compositeOperation: payload.compositeOperation
        } as DaguerreoResult;
    }
}

export type DaguerreoEffect = DaguerreoSourceEffect | DaguerreoTransformEffect;

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
    /**
     * Number ranging from 0-1 that defines the opacity used for compositing
     */
    opacity: number;
    /**
     * The blend mode used for compositing
     */
    compositeOperation: GlobalCompositeOperation;
}

export * from './properties';
export * from './sourceEffect';
export * from './transformEffect';
