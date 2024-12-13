import type { PartialDeep, Promisable } from 'type-fest';
import type { DGComputedProperties, DGTransformProperties } from './properties';

export interface DaguerreoTransformEffect<
    Properties extends DGTransformProperties = DGTransformProperties
> {
    name: string;
    properties?: Properties;
    load?: () => Promisable<void>;
    sourceInitialized?: (
        config: Pick<DaguerreoTransformPayload, 'width' | 'height'>
    ) => Promisable<void>;
    transform: (
        config: DaguerreoTransformPayload & { properties: DGComputedProperties<Properties> }
    ) => Promisable<PartialDeep<DaguerreoTransformResult> | void>;
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
    /**
     * Number ranging from 0-1 that defines the opacity used for compositing
     */
    opacity: number;
    /**
     * The blend mode used for compositing
     */
    compositeOperation: GlobalCompositeOperation;

    ctx: OffscreenCanvasRenderingContext2D;

    matrix: DOMMatrix;
}

export interface DaguerreoTransformResult {
    /**
     * Number ranging from 0-1 that defines the opacity used for compositing
     */
    opacity: number;
    /**
     * The blend mode used for compositing
     */
    compositeOperation: GlobalCompositeOperation;
}

export function defineEffect<Properties extends DGTransformProperties = DGTransformProperties>(
    def: Omit<DaguerreoTransformEffect, 'properties' | 'transform'> & {
        properties?: Properties;
        transform: (
            config: DaguerreoTransformPayload & { properties: DGComputedProperties<Properties> }
        ) => Promisable<PartialDeep<DaguerreoTransformResult> | void>;
    }
) {
    return def as DaguerreoTransformEffect;
}
