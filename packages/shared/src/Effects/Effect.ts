import type {
    DaguerreoTransformEffect,
    DaguerreoTransformPayload,
    DaguerreoTransformResult,
    DGTransformProperty
} from '@safelight/daguerreo';
import type { JsonPrimitive, PartialDeep, Promisable } from 'type-fest';
import type { StoredEffect } from '../base/Storage';

export interface SLTransformProperty<T = any, Meta = Record<string, any>>
    extends DGTransformProperty<T, Meta> {
    default?: T;
    serialize?: (value: T) => JsonPrimitive;
    deserialize?: (data: JsonPrimitive) => T | null;
}

export interface SLEffectProperties {
    [key: string]: SLTransformProperty;
}
export type SLComputedProperties<P extends SLEffectProperties> = {
    [K in keyof P]: ReturnType<NonNullable<P>[K]['value']>;
};

export interface SLTransformEffect<Properties extends SLEffectProperties = SLEffectProperties>
    extends DaguerreoTransformEffect<Properties> {
    transform?: (
        config: DaguerreoTransformPayload & { properties?: SLComputedProperties<Properties> }
    ) => Promisable<PartialDeep<DaguerreoTransformResult> | void>;
}

export function defineEffect<Properties extends SLEffectProperties = SLEffectProperties>(
    def: SLTransformEffect<Properties>
) {
    return def as SLTransformEffect;
}

export class EffectInstance<Properties extends SLEffectProperties = SLEffectProperties> {
    constructor(public effect: SLTransformEffect<Properties>) {}

    /**
     * Keyframes per millisecond
     */
    keyframes = new Map<number, Map<string, any>>();

    setKeyframe<P extends keyof Properties>(
        time: number,
        propertyName: P,
        value: ReturnType<Properties[P]['value']>
    ) {
        const existingKeysAtTime = this.keyframes.get(time);

        if (!existingKeysAtTime) {
            this.keyframes.set(time, new Map<string, any>([[propertyName as string, value]]));
        } else {
            existingKeysAtTime.set(propertyName as string, value);
        }
    }

    deleteKeyframe<P extends keyof Properties>(time: number, propertyName: P) {
        const existingKeysAtTime = this.keyframes.get(time);
        if (existingKeysAtTime) existingKeysAtTime.delete(propertyName as string);
    }

    calculateKeyframeValues(time: number) {
        if (!this.effect.properties) return;

        // Set default values
        const keyframes = Object.fromEntries(
            Object.entries(this.effect.properties).map(([k, v]) => [k, v.default])
        );

        const timeRecords = [...this.keyframes.entries()].sort(([a], [b]) => a - b);

        // Step through the sorted times
        for (const [kTime, keyframe] of timeRecords) {
            // Break when the time is more than the desired time
            if (kTime > time) break;

            // For each property, set the current value to the most recent value
            for (const [property, value] of keyframe.entries()) {
                keyframes[property] = value;
            }
        }

        return keyframes as SLComputedProperties<Properties>;
    }

    serialize(): StoredEffect {
        // Looks fucky wucky, is not
        const keyframes = Object.fromEntries(
            this.keyframes.entries().map(([k, v]) => [k, Object.fromEntries(v.entries())])
        );

        // More data can be added here in the future
        return {
            effectId: this.effect.name,
            keyframes
        };
    }
}
