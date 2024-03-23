<template>
    <div
        class="layerItem"
        :style="{
            top: ySmooth + 'px',
            height: height + 'px'
        }"
    >
        <div
            id="resizeHandle"
            @mousedown="startResize"
            @mouseup="endResize"
            @dblclick="resetHeight"
        />
        <slot :layer="layer" :height="height">
            {{ layer }}
        </slot>
    </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { computed, inject, ref } from 'vue';
import type { TimelineViewport } from '.';

const { layer } = defineProps<{ layer: number }>();
const viewport = inject('viewport') as TimelineViewport;

const height = computed(
    () =>
        viewport.LayerToYPosition(layer, false, true) - viewport.LayerToYPosition(layer, true, true)
);

const y = computed(() => viewport!.LayerToYPosition(layer, true, true));
const ySmooth = y;

const isResizing = ref(false);

const startY = ref(0);
const startHeight = ref(0);

const minHeight = 22;

useEventListener('mousemove', resizing);
useEventListener('mouseup', endResize);

function startResize(ev: MouseEvent) {
    isResizing.value = true;
    startY.value = ev.clientY;
    startHeight.value = viewport.layerHeights[layer] ?? viewport.defaultLayerHeight;
}
function resizing(ev: MouseEvent) {
    if (isResizing.value) {
        window.getSelection()?.removeAllRanges();
        const newHeight = startY.value - ev.clientY + startHeight.value;
        viewport!.layerHeights[layer] = Math.max(newHeight, minHeight);
    }
}
function endResize() {
    if (isResizing.value) {
        isResizing.value = false;
    }
}

function resetHeight() {
    viewport!.layerHeights[layer] = viewport!.defaultLayerHeight;
}
</script>

<style lang="scss" scoped>
.layerItem {
    position: absolute;
    overflow-x: scroll;
    overflow-y: hidden;
    background-color: #18181b;
    height: 32px;
    z-index: 3;
    width: 100%;

    p {
        margin: 0;
        white-space: nowrap;
    }

    #resizeHandle {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 3px;
        cursor: ns-resize;

        background-color: #3f3f46;
    }
}
</style>
