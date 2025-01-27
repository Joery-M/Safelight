import type { DaguerreoSourceEffect } from '@safelight/daguerreo';

// In the future this can have more functionality
export interface SLSourceEffect extends DaguerreoSourceEffect {}

export function defineSource(def: SLSourceEffect) {
    return def;
}
