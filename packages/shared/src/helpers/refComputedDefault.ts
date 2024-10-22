import { extendRef, toValue, type MaybeRefOrGetter } from '@vueuse/core';
import { computed, type Ref } from 'vue';

/**
 * Apply computed default value to a ref.
 *
 * @source https://vueuse.org/shared/refDefault/
 */
export function refComputedDefault<T>(
    source: Ref<T | undefined | null>,
    defaultValue: MaybeRefOrGetter<T>,
    strict = true
) {
    const comp = computed<T>({
        get() {
            return strict
                ? (source.value ?? toValue(defaultValue))
                : source.value || toValue(defaultValue);
        },
        set(value) {
            source.value = value;
        }
    });

    return extendRef(comp, {
        source
    });
}
