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

    const baseFps = 1000 / 60;

    let animating = false;
    let lastTime = performance.now();

    function step(time: DOMHighResTimeStamp) {
        if (Math.abs(outputVal.value - sourceVal.value) > snapOffsetVal.value) {
            animating = true;

            const dist = sourceVal.value - outputVal.value;
            const deltaTime = time - lastTime;
            const delta = Math.min((deltaTime / baseFps) * stepPercVal.value, stepPercVal.value);

            outputVal.value = outputVal.value + dist * delta;
            requestAnimationFrame(step);
        } else {
            outputVal.value = sourceVal.value;
            animating = false;
        }
        lastTime = time;
    }

    requestAnimationFrame(step);

    watch([sourceVal, stepPercVal, snapOffsetVal], () => {
        if (!animating) {
            requestAnimationFrame(step);
        }
    });

    return readonly(outputVal);
}
