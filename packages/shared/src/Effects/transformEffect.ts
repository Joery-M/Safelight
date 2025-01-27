import type {
    DaguerreoTransformEffect,
    DaguerreoTransformPayload,
    DaguerreoTransformResult,
    DGTransformProperty
} from '@safelight/daguerreo';
import type { JsonPrimitive, PartialDeep, Promisable } from 'type-fest';

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
