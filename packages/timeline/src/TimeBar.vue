<template>
    <canvas
        ref="canvas"
        :width="bounding.width.value * devicePixelRatio"
        :height="bounding.height.value * devicePixelRatio"
        @mousedown="startMove"
    />
</template>

<script setup lang="ts">
import { useElementBounding, useWindowSize } from '@vueuse/core';
import { inject, onMounted, onUpdated, ref, watch } from 'vue';
import { TimelineViewport } from '.';

const viewport = inject('viewport') as TimelineViewport;

const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | undefined;

const bounding = useElementBounding(canvas);
viewport.timebarHeight = bounding.height;

const devicePixelRatio = ref(window.devicePixelRatio);

watch(useWindowSize().width, () => {
    devicePixelRatio.value = window.devicePixelRatio;
});

onMounted(() => {
    if (canvas.value && !__TEST__) {
        ctx = canvas.value.getContext('2d') ?? undefined;
    }
    drawAll();
    watch([viewport.startTime, viewport.endTime], () => drawAll());
    watch([bounding.width, bounding.height], () => requestAnimationFrame(drawAll));
});

onUpdated(() => drawAll());

function drawAll() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.value?.width ?? 1000, canvas.value?.height ?? 1000);

    // every frame
    const frameWidth = viewport.getTimePosition(1000 / viewport.fps.value);
    if (frameWidth > 25) {
        drawTicks(
            ctx,
            frameWidth,
            bounding.height.value * 0.4 * devicePixelRatio.value,
            'rgba(255, 255, 255, 0.2)',
            false
        );
    }
    // 500ms
    drawTicks(
        ctx,
        viewport.getTimePosition(100),
        bounding.height.value * 0.6 * devicePixelRatio.value,
        'rgba(255, 255, 255, 0.3)'
    );
    // 1s
    drawTicks(
        ctx,
        viewport.getTimePosition(1000),
        bounding.height.value * devicePixelRatio.value,
        'rgba(255, 255, 255, 0.5)'
    );
}

function drawTicks(
    ctx: CanvasRenderingContext2D,
    step: number,
    height: number,
    color: string,
    clearLast = true
) {
    if (step === 0) {
        return;
    }
    const pos = (viewport.getTimePosition(viewport.startTime.value) % step) - step;
    const totalSteps = Math.ceil(bounding.width.value / step);

    ctx.fillStyle = color;
    for (let i = 0; i < totalSteps; i++) {
        if (clearLast) {
            ctx.clearRect(
                (i * step - pos - 1) * devicePixelRatio.value,
                0,
                3,
                bounding.height.value * devicePixelRatio.value
            );
        }
        ctx.fillRect((i * step - pos) * devicePixelRatio.value, 0, 1, height);
    }
}

// Dragging

const lastPos = ref(0);
const virtualPos = ref(0);
const isMoving = ref(false);
let lastMoveTime = 0;

function startMove(ev: MouseEvent) {
    isMoving.value = true;
    lastPos.value = ev.clientX;
    virtualPos.value =
        viewport.getPositionTime(ev.clientX - bounding.x.value) + viewport.startTime.value;
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

defineExpose({ moving, endMove });
</script>

<style lang="scss" scoped>
canvas {
    height: 2em;
    width: 100%;
    user-select: none;
    position: absolute;
    z-index: 4;
    background: linear-gradient(to bottom, var(--surface-overlay) -30%, transparent 100%);
}
</style>
