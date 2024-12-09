import type { Promisable } from 'type-fest';
import type { DGComputedProperties, DGTransformProperties } from './properties';

export interface DaguerreoTransformEffect<
    Properties extends DGTransformProperties = { [key: string]: any }
> {
    name: string;
    properties?: Properties;
    load?: () => Promisable<void>;
    sourceInitialized?: (
        config: Pick<DaguerreoTransformPayload, 'width' | 'height'>
    ) => Promisable<void>;
    transform: (
        config: DaguerreoTransformPayload & { properties: DGComputedProperties<Properties> }
    ) => Promisable<void>;
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

export function defineEffect<Properties extends DGTransformProperties = {}>(
    def: Omit<DaguerreoTransformEffect, 'properties' | 'transform'> & {
        properties?: Properties;
        transform: (
            config: DaguerreoTransformPayload & { properties: DGComputedProperties<Properties> }
        ) => Promisable<void>;
    }
) {
    return def as DaguerreoTransformEffect<Properties>;
}
