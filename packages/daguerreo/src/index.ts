import { computed, shallowReactive, shallowRef } from 'vue';
import {
    getDefaultProperties,
    type DGTransformProperties,
    type DGTransformProperty
} from './properties';
import type { DaguerreoSourceEffect, DaguerreoSourcePayload } from './sourceEffect';
import type { DaguerreoTransformEffect, DaguerreoTransformPayload } from './transformEffect';

export class Daguerreo {
    private source = shallowRef<DaguerreoSourceEffect | undefined>(undefined);
    readonly effects = shallowReactive<DaguerreoTransformEffect[]>([]);
    private effectsWithSourceInitHooks = computed(() =>
        this.effects.filter((e) => !!e.sourceInitialized)
    );
    private effectsWithTransformHooks = computed(() => this.effects.filter((e) => !!e.transform));
    private ranLoadFunction = false;

    addEffect(effect: DaguerreoTransformEffect) {
        this.effects.push(effect);
    }
    removeEffect(effect: DaguerreoTransformEffect) {
        this.effects.slice(this.effects.indexOf(effect) - 1, 1);
    }
    setSource(source: DaguerreoSourceEffect) {
        this.source.value = source;
        this.ranLoadFunction = false;
    }

    reset() {
        this.source.value = undefined;
        this.ranLoadFunction = false;
        this.effects.splice(0, this.effects.length);
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
        sourceProps: DGTransformProperties,
        transformProps: DGTransformProperties[] = this.getTransformProps()
    ): Promise<DaguerreoResult> {
        const effectBase = this.source.value;
        if (!effectBase) throw new Error('No source effect defined');

        if (!this.ranLoadFunction) {
            this.ranLoadFunction = true;
            await effectBase.load?.();
        }

        const props = getDefaultProperties(sourceProps, this.source.value?.properties);

        const payload: DaguerreoTransformPayload = Object.assign(
            // Default values
            {
                matrix: new DOMMatrix(),
                compositeOperation: 'source-over',
                opacity: 1,
                frame: config.frame,
                frameDuration: config.frameDuration,
                width: config.width,
                height: config.height,
                maxWidth: config.width,
                maxHeight: config.height,
                quality: config.quality
            },
            await effectBase.source({ ...config, properties: props })
        );

        switch (config.quality) {
            case 'preview':
                payload.ctx.imageSmoothingQuality = 'medium';
                break;
            case 'rough':
                payload.ctx.imageSmoothingQuality = 'low';
                break;

            default:
                payload.ctx.imageSmoothingQuality = 'high';
                break;
        }

        // Run initialize methods
        const initFunctions = this.effectsWithSourceInitHooks.value.map((e) =>
            e.sourceInitialized?.({ height: payload.height, width: payload.width })
        );
        await Promise.allSettled(initFunctions);

        // Run effects
        for (let i = 0; i < this.effectsWithTransformHooks.value.length; i++) {
            const effect = this.effectsWithTransformHooks.value[i];

            const props = getDefaultProperties(effect.properties, transformProps[i]);

            const result = await effect.transform!({ ...payload, properties: props });
            // Assign props
            if (result) Object.assign(payload, result);
        }

        return {
            width: payload.width,
            height: payload.height,
            frameDuration: config.frameDuration,
            image: payload.ctx.canvas.transferToImageBitmap(),
            matrix: payload.matrix,
            opacity: payload.opacity,
            compositeOperation: payload.compositeOperation
        } as DaguerreoResult;
    }
}

export type QualitySetting = 'rough' | 'preview' | 'final';

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
    /**
     * Current frame duration
     */
    frameDuration: number;

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
