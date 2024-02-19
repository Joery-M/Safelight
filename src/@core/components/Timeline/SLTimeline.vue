<template>
    <div class="timeline">
        <div ref="timelineContainer" v-bind="$attrs" class="timeline-container">
            <div
                id="container-scroll-boundary"
                :style="{
                    width: useProjection(lastEnd).value + 'px',
                    height: (highestLayer + 1) * rowHeight + 'px'
                }"
            />
            <template v-for="(item, itemI) in items" :key="itemI">
                <div
                    v-if="item.start < scrollOffsetX + end && item.end > scrollOffsetX"
                    class="timeline-item"
                    :class="{ ['num-' + itemI]: true }"
                    :style="{
                        '--x': useProjection(item.start).value + 'px',
                        '--y': rowHeight * item.layer + 'px',
                        height: rowHeight + 'px',
                        '--width':
                            useProjection(item.end).value - useProjection(item.start).value + 'px'
                    }"
                >
                    <p>{{ item.title }}</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        cursor?: number;
        start?: number;
        end?: number;
        endPadding?: number;
    }>(),
    {
        cursor: undefined,
        start: 0,
        end: 120, // Assuming 1 = 1 second
        endPadding: 10
    }
);

const rowHeight = ref(32);
const highestLayer = ref(0);
const lastEnd = ref(120);
let scrollOffsetX = ref(0);
let scrollOffsetY = ref(0);
const items = defineModel<TimelineComponentItem[]>({ default: [] });

const viewRange = ref<[number, number]>([props.start, props.end]);
const timelineContainer = ref<HTMLDivElement>();
const containerSizeRange = ref<[number, number]>([0, 100]);

watch(props, () => {
    viewRange.value = [
        parseFloat(props.start.toString()) ?? 0,
        parseFloat(props.end.toString()) ?? 0
    ];

    if (items.value && items.value.length > 0) {
        const last = items.value.sort((a, b) => b.end - a.end)[0];
        lastEnd.value = last.end;
    }
});

watchImmediate(items, () => {
    if (items.value && items.value.length > 0) {
        const highest = items.value.sort((a, b) => b.layer - a.layer)[0];
        highestLayer.value = highest.layer;

        const last = items.value.sort((a, b) => b.end - a.end)[0];
        lastEnd.value = last.end;
    }
});

onMounted(() => {
    const containerSize = useElementSize(timelineContainer);

    watchImmediate(containerSize.width, () => {
        containerSizeRange.value = [0, containerSize.width.value];
    });

    const scrolling = useScroll(timelineContainer);
    scrollOffsetX = useProjectionInverse(scrolling.x);
    scrollOffsetY = scrolling.y;
});

const useProjectionInverse = createProjection(containerSizeRange, viewRange);
const useProjection = createProjection(viewRange, containerSizeRange);

export interface TimelineComponentItem {
    start: number;
    end: number;
    title: string;
    layer: number;
}
</script>

<style lang="scss" scoped>
.timeline {
    @apply relative;
}
.timeline-container {
    @apply relative left-0 top-0 h-full w-full scroll-px-32 overflow-auto;

    #container-scroll-boundary {
        @apply absolute bottom-0;
    }
}

.timeline-scroll-container {
    @apply relative h-4 overflow-auto;
    > div {
        @apply absolute left-0 top-0 h-4;
    }
}

.timeline-item {
    @apply absolute;
    left: var(--x);
    bottom: var(--y);
    width: var(--width);
}

.timeline-item.num-0 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-1 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-2 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-3 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-4 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-5 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-6 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-7 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-8 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
.timeline-item.num-9 {
    background-color: rgb(random($limit: 255), random($limit: 255), random($limit: 255));
}
</style>
