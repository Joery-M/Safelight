export function dgNumberProperty(value: number): DGTransformProperty<number> {
    return {
        type: 'number',
        value() {
            return value;
        }
    };
}

export type DGPropertyTypes = 'number';

export type DGTransformProperty<T = any> = {
    type: DGPropertyTypes;
    value(): T;
};

export interface DGTransformProperties {
    [key: string]: DGTransformProperty;
}
export type DGComputedProperties<P extends DGTransformProperties | undefined> = P extends undefined
    ? undefined
    : {
          [K in keyof P]: ReturnType<NonNullable<P>[K]['value']>;
      };
