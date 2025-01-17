import type { PartialDeep } from 'type-fest';
import type { SLTransformProperty } from './Effect';
import { ref } from 'vue';

export interface NumberPropertyConfig {
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
}
export function numberProperty(
    value: number,
    meta?: PartialDeep<NumberPropertyConfig>
): SLTransformProperty<number, PartialDeep<NumberPropertyConfig>> {
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
    meta: Record<string, any>
): SLTransformProperty<boolean> {
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
    meta: Record<string, any>
): SLTransformProperty<string> {
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
