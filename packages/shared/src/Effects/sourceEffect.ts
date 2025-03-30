import type { DaguerreoSourceEffect } from '@safelight/daguerreo';
import type { Promisable } from 'type-fest';
import type { MediaItem } from '../Media/Media';

// In the future this can have more functionality
export interface SLSourceEffect extends Omit<DaguerreoSourceEffect, 'load'> {
    load?: (media: MediaItem) => Promisable<boolean>;
}

export function defineSource(def: SLSourceEffect) {
    return def;
}
