import { v4 as uuidv4 } from 'uuid';
import type { StoredSource } from '../base/Storage';
import type { SLSourceEffect } from './sourceEffect';

export class SourceEffectInstance {
    // Only for lists, not used in storage
    id = uuidv4();

    constructor(public effect: SLSourceEffect) {}

    serialize = (): StoredSource => {
        // More data can be added here in the future
        return {
            effectId: this.effect.name
        };
    };
}
