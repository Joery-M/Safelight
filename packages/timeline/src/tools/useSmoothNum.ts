import { MaybeRefOrGetter } from '@vueuse/core';
import { readonly, ref, toRef, toValue, watch } from 'vue';

export function useSmoothNum(
    source: MaybeRefOrGetter<number>,
    options: {
        stepPerc?: MaybeRefOrGetter<number>;
        snapOffset?: MaybeRefOrGetter<number>;
        startingValue?: MaybeRefOrGetter<number>;
    } = {}
) {
    const sourceVal = toRef(source);
    const stepPercVal = toRef(options?.stepPerc ?? 0.5);
    const snapOffsetVal = toRef(options?.snapOffset ?? 0.000001);

    const outputVal = ref(toValue(options.startingValue) ?? sourceVal.value);

    // Instant return in test
    if (__TEST__) {
        return readonly(outputVal);
    }

    let animating = false;
    function step() {
        if (Math.abs(outputVal.value - sourceVal.value) > snapOffsetVal.value) {
            animating = true;

            const dist = sourceVal.value - outputVal.value;

            outputVal.value = outputVal.value + dist * stepPercVal.value;
            requestAnimationFrame(step);
        } else {
            outputVal.value = sourceVal.value;
            animating = false;
        }
    }

    requestAnimationFrame(step);

    watch([sourceVal, stepPercVal, snapOffsetVal], () => {
        if (!animating) {
            requestAnimationFrame(step);
        }
    });

    return readonly(outputVal);
}
