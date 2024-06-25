<template>
    <div
        v-if="isVisible"
        id="pbHead"
        role="slider"
        aria-label="Playback head"
        :style="{
            left: left + 'px'
        }"
    >
        <div id="pbHandle" @mousedown="startMove"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { TimelineViewport } from '.';

const viewport = inject('viewport') as TimelineViewport;

const left = computed(
    () => viewport.getTimePosition(viewport.pbPos.value ?? 0) - viewport.offsetX.value
);

const isVisible = computed(() =>
    viewport.isItemVisible({
        start: (viewport.pbPos.value ?? 0) - 50,
        duration: 100
    })
);

const lastPos = ref(0);
const virtualPos = ref(0);
const isMoving = ref(false);

defineExpose({ moving, endMove });
let lastMoveTime = 0;

function startMove(ev: MouseEvent) {
    isMoving.value = true;
    lastPos.value = ev.clientX;
    virtualPos.value = viewport.pbPos.value!;
}
function moving(ev: MouseEvent) {
    if (isMoving.value) {
        window.getSelection()?.removeAllRanges();
        virtualPos.value = virtualPos.value + viewport.getPositionTime(ev.clientX - lastPos.value);
        if (performance.now() - lastMoveTime > 10) {
            viewport.pbPos.value =
                Math.round(Math.max(0, virtualPos.value) / viewport.frameDuration.value) *
                viewport.frameDuration.value;
            lastMoveTime = performance.now();
        }
        lastPos.value = ev.clientX;
    }
}
function endMove() {
    if (isMoving.value) {
        isMoving.value = false;
        viewport.pbPos.value =
            Math.round(Math.max(0, virtualPos.value) / viewport.frameDuration.value) *
            viewport.frameDuration.value;
    }
}
</script>

<style scoped lang="scss">
#pbHead {
    position: absolute;
    width: 2px;
    height: 100%;
    z-index: 4;
    background: var(--red-600);

    #pbHandle {
        width: 1em;
        left: calc(-0.5em + 1px);
        height: 1em;
        position: absolute;
        background: var(--red-600);
        cursor: ew-resize;
        clip-path: polygon(50% 100%, 100% 62%, 100% -10%, 0 -10%, 0% 62%);
    }
}
</style>
