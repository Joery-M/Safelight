import type { Promisable, SetRequired } from 'type-fest';
import type { DGComputedProperties, DGTransformProperties, QualitySetting } from '.';
import type { DaguerreoTransformPayload } from './transformEffect';

export interface DaguerreoSourceEffect<
    Properties extends DGTransformProperties = DGTransformProperties
> {
    name: string;
    properties?: Properties;
    load?: () => Promisable<void>;
    source: (
        config: DaguerreoSourcePayload & { properties: DGComputedProperties<Properties> }
    ) => Promisable<DaguerreoSourceResult>;
}

export type DaguerreoSourceResult = SetRequired<Partial<DaguerreoTransformPayload>, 'ctx'>;

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
    /**
     * The desired rendering quality.
     *
     * For if your source effect is able to render with different
     * performance characteristics.
     */
    quality: QualitySetting;
}

export function defineSource(def: DaguerreoSourceEffect) {
    return def;
}
