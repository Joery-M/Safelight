import type { Promisable, SetRequired } from 'type-fest';
import type { DaguerreoTransformPayload } from './transformEffect';

export interface DaguerreoSourceEffect {
    name: string;
    load?: () => Promisable<void>;
    source: (config: DaguerreoSourcePayload) => Promisable<DaguerreoSourceResult>;
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
}

export function defineSource(def: DaguerreoSourceEffect) {
    return def;
}
