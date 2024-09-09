import { MaybeRefOrGetter, toValue } from '@vueuse/core';
import { customRef, watchEffect } from 'vue';

export function useSteppedRef(start: number, step: MaybeRefOrGetter<number>) {
    return customRef((track, trigger) => {
        let sourceValue = start;
        let value = start;
        let stepNum = toValue(step);

        watchEffect(() => {
            stepNum = toValue(step);
            const oldVal = value;
            value = Math.ceil(sourceValue / stepNum) * stepNum;
            if (value !== oldVal) {
                trigger();
            }
        });

        return {
            get() {
                track();
                return value;
            },
            set: (newValue) => {
                const oldVal = value;
                sourceValue = newValue;
                value = Math.ceil(sourceValue / stepNum) * stepNum;
                if (value !== oldVal) {
                    trigger();
                }
            }
        };
    });
}
