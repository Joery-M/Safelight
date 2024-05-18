<template>
    <canvas ref="canvas" :width="bounding.width.value" :height="bounding.height.value" />
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core';
import { inject, onMounted, onUpdated, ref, watch } from 'vue';
import { TimelineViewport } from '.';

const viewport = inject('viewport') as TimelineViewport;

const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | undefined;

const bounding = useElementBounding(canvas);
viewport.timebarHeight = bounding.height;

onMounted(() => {
    if (canvas.value) {
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
        drawTicks(ctx, frameWidth, bounding.height.value * 0.4, 'rgba(255, 255, 255, 0.2)', false);
    }
    // 500ms
    drawTicks(
        ctx,
        viewport.getTimePosition(100),
        bounding.height.value * 0.6,
        'rgba(255, 255, 255, 0.3)'
    );
    // 1s
    drawTicks(
        ctx,
        viewport.getTimePosition(1000),
        bounding.height.value,
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
            ctx.clearRect(i * step - pos - 1, 0, 3, bounding.height.value);
        }
        ctx.fillRect(i * step - pos, 0, 1, height);
    }
}
</script>

<style lang="scss" scoped>
canvas {
    height: 2em;
    pointer-events: none;
    user-select: none;
}
</style>
