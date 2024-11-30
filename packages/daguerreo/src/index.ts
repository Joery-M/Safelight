import type { Promisable } from 'type-fest';
import type {
    DGComputedProperties,
    DGTransformProperties,
    DGTransformProperty
} from './properties';

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

    async process(config: DaguerreoSourcePayload): Promise<DaguerreoResult> {
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
        for await (const effect of this.effects) {
            const props: DGTransformProperties = {};
            if (effect.properties) {
                for (const key in effect.properties) {
                    if (Object.prototype.hasOwnProperty.call(effect.properties, key)) {
                        const prop = effect.properties[key];
                        props[key] = prop.value(config.frame);
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

export function defineEffect<Properties extends DGTransformProperties = {}>(
    def: Omit<DaguerreoTransformEffect, 'properties' | 'transform'> & {
        properties?: Properties;
        transform: (
            config: DaguerreoTransformPayload & { properties: DGComputedProperties<Properties> }
        ) => Promisable<void>;
    }
) {
    return def as Omit<DaguerreoTransformEffect, 'properties'> & { properties: Properties };
}

export interface DaguerreoTransformEffect {
    name: string;
    properties?: { [k: string]: DGTransformProperty };
    load?: () => Promisable<void>;
    sourceInitialized?: (
        config: Pick<DaguerreoTransformPayload, 'width' | 'height'>
    ) => Promisable<void>;
    transform: (config: DaguerreoTransformPayload & { properties: {} }) => Promisable<void>;
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

export interface DaguerreoTransformPayload {
    /**
     * Current frame number
     */
    frame: number;
    /**
     * How long the current frame will last for in milliseconds.
     */
    frameDuration: number;
    /**
     * Current frame width
     */
    width: number;
    /**
     * Current frame height
     */
    height: number;

    ctx: OffscreenCanvasRenderingContext2D;

    matrix: DOMMatrix;
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
