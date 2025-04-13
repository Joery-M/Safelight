import type { DaguerreoSourceEffect } from '@safelight/daguerreo';
import type { Promisable } from 'type-fest';
import type { MediaItem } from '../Media/Media';
import type { SLEffectProperties } from './transformEffect';

// In the future this can have more functionality
export interface SLSourceEffect<Properties extends SLEffectProperties = SLEffectProperties>
    extends Omit<DaguerreoSourceEffect<Properties>, 'load'> {
    load?: (media: MediaItem) => Promisable<boolean>;
}

export function defineSource(def: SLSourceEffect) {
    return def;
}
