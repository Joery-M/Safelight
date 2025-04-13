import type { PartialDeep } from 'type-fest';
import { ref, shallowRef } from 'vue';
import type { MediaItemTypes } from '../Media/Media';
import type { SLEffectProperty } from './transformEffect';

export type NumberPropertyConfig = PartialDeep<{
    min: number;
    max: number;
    step: number;
    slider: boolean;
    /**
     * @default false
     */
    integerOnly: boolean;
    transform: {
        toDisplay: (value: number) => number;
        toValue: (display: number) => number;
    };
}>;

export function numberProperty(
    value: number,
    meta?: NumberPropertyConfig
): SLEffectProperty<number, NumberPropertyConfig> {
    const curValue = ref(value);
    return {
        type: 'number',
        default: value,
        value() {
            return curValue.value;
        },
        displayValue() {
            return meta?.transform?.toDisplay
                ? meta.transform.toDisplay(curValue.value)
                : curValue.value;
        },
        setValue(value: number) {
            curValue.value = meta?.transform?.toValue ? meta.transform.toValue(value) : value;
        },
        meta
    };
}

export function booleanProperty(
    value: boolean,
    meta?: Record<string, any>
): SLEffectProperty<boolean> {
    const curValue = ref(value);

    return {
        type: 'boolean',
        default: value,
        value() {
            return curValue.value ?? false;
        },
        setValue(v) {
            curValue.value = v;
        },
        meta
    };
}

export function stringProperty(
    value: string,
    meta?: Record<string, any>
): SLEffectProperty<string> {
    const curValue = ref(value);

    return {
        type: 'string',
        default: value,
        value() {
            return curValue.value ?? '';
        },
        setValue(v) {
            curValue.value = v;
        },
        meta
    };
}

export type MediaPropertyConfig = PartialDeep<{
    allowedTypes: MediaItemTypes[];
}>;

export function mediaItemProperty(
    meta?: MediaPropertyConfig
): SLEffectProperty<string | null, MediaPropertyConfig> {
    const curValue = shallowRef<string | null>(null);
    return {
        type: 'MediaItem',
        default: null,
        value() {
            return curValue.value;
        },
        setValue(v) {
            curValue.value = v;
        },
        meta
    };
}
