import type { PartialDeep } from 'type-fest';
import { ref } from 'vue';

export function dgNumberProperty(
    value: number,
    meta?: PartialDeep<NumberPropertyConfig>
): DGTransformProperty<number, PartialDeep<NumberPropertyConfig>> {
    const curValue = ref(value);
    return {
        type: 'number',
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

export type DGPropertyTypes = 'number';

export type DGTransformProperty<T = any, Meta = Record<string, any>> = {
    type: DGPropertyTypes;
    value(): T;
    displayValue(): T;
    setValue(v: T): void;
    meta?: Meta;
};

export interface DGTransformProperties {
    [key: string]: DGTransformProperty;
}
export type DGComputedProperties<P extends DGTransformProperties | undefined> = P extends undefined
    ? undefined
    : {
          [K in keyof P]: ReturnType<NonNullable<P>[K]['value']>;
      };
