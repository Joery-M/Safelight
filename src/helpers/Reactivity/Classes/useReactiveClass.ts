import type { MaybeRefOrGetter } from '@vueuse/core';

export function useReactiveClass<T extends object>(sourceClass: MaybeRefOrGetter<T>) {
    let value: T = toValue(sourceClass);

    return customRef((track, trigger) => {
        if (isRef(sourceClass)) {
            watchDeep(sourceClass, (newVal) => {
                console.log('A');
                value = newVal;
                trigger();
            });
        }

        return {
            get() {
                track();
                return value;
            },
            set(newValue) {
                value = newValue;
                trigger();
            }
        };
    });
}
