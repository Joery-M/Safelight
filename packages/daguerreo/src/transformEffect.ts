import type { PartialDeep, Promisable } from 'type-fest';
import type { DGComputedProperties, DGTransformProperties } from './properties';
import type { QualitySetting } from '.';

export interface DaguerreoTransformEffect<
    Properties extends DGTransformProperties = DGTransformProperties
> {
    name: string;
    properties?: Properties;
    load?: () => Promisable<void>;
    sourceInitialized?: (
        config: Pick<DaguerreoTransformPayload, 'width' | 'height'>
    ) => Promisable<void>;
    transform?: (
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
     * Source width
     */
    width: number;
    /**
     * Source height
     */
    height: number;
    /**
     * Viewport/timeline width
     */
    maxWidth: number;
    /**
     * Viewport/timeline height
     */
    maxHeight: number;
    /**
     * Number ranging from 0-1 that defines the opacity used for compositing
     */
    opacity: number;
    /**
     * The blend mode used for compositing
     */
    compositeOperation: GlobalCompositeOperation;
    /**
     * The desired rendering quality.
     *
     * For if your effect is able to render with different
     * performance characteristics.
     */
    quality: QualitySetting;

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
    def: DaguerreoTransformEffect<Properties>
) {
    return def as DaguerreoTransformEffect;
}
