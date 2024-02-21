<template>
    <div class="timeline">
        <div
            ref="timelineContainer"
            v-bind="$attrs"
            class="timeline-container"
            @pointerdown="dragStart"
            @pointermove="dragging"
            @pointerup="dragEnd()"
            @click.self="selectedItems = []"
        >
            <div
                v-show="selectionDrag"
                id="selection-box"
                :style="{
                    left: Math.min(selectionBox.x1, selectionBox.x2) + 'px',
                    top: Math.min(selectionBox.y1, selectionBox.y2) + 'px',
                    width:
                        Math.max(selectionBox.x1, selectionBox.x2) -
                        Math.min(selectionBox.x1, selectionBox.x2) +
                        'px',
                    height:
                        Math.max(selectionBox.y1, selectionBox.y2) -
                        Math.min(selectionBox.y1, selectionBox.y2) +
                        'px'
                }"
            />
            <div
                id="container-scroll-boundary"
                :style="{
                    width: useProjection(lastEnd).value + 'px',
                    height: (highestLayer + 1) * rowHeight + 'px'
                }"
            />
            <template v-for="row in highestLayer" :key="row">
                <div class="timeline-row"></div>
            </template>
            <template v-for="(item, itemI) in items" :key="itemI">
                <div
                    v-if="item.start < scrollOffsetX + end && item.end > scrollOffsetX"
                    class="timeline-item"
                    :class="{
                        ['num-' + itemI]: true,
                        selected: useArrayIncludes(selectedItems, item).value
                    }"
                    :style="{
                        left: useProjection(item.start).value + 'px',
                        bottom: rowHeight * item.layer + 'px',
                        height: rowHeight + 'px',
                        width:
                            useProjection(item.end).value - useProjection(item.start).value + 'px'
                    }"
                    @click="toggleSelect(item)"
                >
                    <p>{{ item.title }}</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
withDefaults(
    defineProps<{
        cursor?: number;
        endPadding?: number;
    }>(),
    {
        cursor: undefined,
        endPadding: 10
    }
);

const rowHeight = ref(32);
const highestLayer = ref(0);
const lastEnd = ref(120);
let scrollOffsetX = ref(0);
let scrollOffsetY = ref(0);
const items = defineModel<TimelineComponentItem[]>({ default: [] });
const start = defineModel<number>('start', { default: 0 });
const end = defineModel<number>('end', { default: 120 });
const selectedItems = ref<TimelineComponentItem[]>([]);

const selectionDrag = ref(false);
const selectionBox = reactive({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
});

const viewRange = ref<[number, number]>([0, end.value]);
const timelineContainer = ref<HTMLDivElement>();
const containerSizeRange = ref<[number, number]>([0, 100]);

watch([end, items], () => {
    viewRange.value = [0, parseFloat(end.value.toString()) ?? 0];

    if (items.value && items.value.length > 0) {
        const last = items.value.sort((a, b) => b.end - a.end)[0];
        lastEnd.value = last.end;
    }
});

const containerBoundingBox = useElementBounding(timelineContainer);

onMounted(() => {
    const containerSize = useElementSize(timelineContainer);

    watchImmediate(containerSize.width, () => {
        containerSizeRange.value = [0, containerSize.width.value];
    });

    const scrolling = useScroll(timelineContainer);
    scrollOffsetX = useProjectionInverse(scrolling.x);
    scrollOffsetY = scrolling.y;

    watch(start, () => {
        scrolling.x.value = useProjection(start).value;
    });

    watch(scrolling.x, () => {
        start.value = useProjectionInverse(scrolling.x.value).value;
    });

    watchImmediate(items, () => {
        console.log(items.value);
        if (items.value.length > 0) {
            const highest = items.value.sort((a, b) => b.layer - a.layer)[0];
            highestLayer.value = highest.layer;

            const last = items.value.sort((a, b) => b.end - a.end)[0];
            lastEnd.value = last.end;
        }
    });
});

const useProjectionInverse = createProjection(containerSizeRange, viewRange);
const useProjection = createProjection(viewRange, containerSizeRange);

export interface TimelineComponentItem {
    start: number;
    end: number;
    title: string;
    layer: number;
    isGhost: boolean;
}

function fitAll() {
    console.log('Fit all');
}

function toggleSelect(item: TimelineComponentItem) {
    if (selectedItems.value.includes(item)) {
        const index = selectedItems.value.indexOf(item);
        selectedItems.value.splice(index, 1);
    } else {
        selectedItems.value.push(item);
    }
}

function dragStart(ev: PointerEvent) {
    selectionBox.x1 = ev.clientX - containerBoundingBox.x.value;
    selectionBox.y1 = ev.clientY - containerBoundingBox.y.value;
    selectionBox.x2 = ev.clientX - containerBoundingBox.x.value;
    selectionBox.y2 = ev.clientY - containerBoundingBox.y.value;
    selectionDrag.value = true;
}

function dragging(ev: PointerEvent) {
    if (selectionDrag.value) {
        selectionBox.x2 = ev.x - containerBoundingBox.x.value;
        selectionBox.y2 = ev.y - containerBoundingBox.y.value;

        // Get all items that are in the range
        items.value.forEach((item) => {});
    }
}

function dragEnd() {
    selectionDrag.value = false;
}

defineExpose({
    resizeToFitAll: fitAll
});
</script>

<style lang="scss" scoped>
.timeline {
    @apply relative;
}
.timeline-container {
    @apply relative left-0 top-0 h-full w-full scroll-px-32 overflow-auto;

    #container-scroll-boundary {
        @apply pointer-events-none absolute bottom-0;
    }

    .timeline-row {
        @apply pointer-events-none absolute h-4;
    }
}

.timeline-scroll-container {
    @apply relative h-4 overflow-auto;
    > div {
        @apply absolute left-0 top-0 h-4;
    }
}

.timeline-item {
    @apply bg-accent-900 border-accent-700 absolute select-none border-0
        transition-all duration-75 hover:z-10 hover:border-2;

    transition-property: border;

    &.selected {
        @apply border-accent-500 border-2;
    }
}

#selection-box {
    @apply absolute select-none border-2 fill-base-700 opacity-100;
}

// This is only for test colors, this can and will be removed in the future
// @for $i from 0 through 100 {
//     .timeline-item.num-#{$i} {
//         $color: hsl(
//             random(
//                 $limit: 360
//             ),
//             80%,
//             50%
//         );
//         @if lightness($color) > 50 {
//             color: black;
//         }
//         @if lightness($color) <= 50 {
//             color: white;
//         }
//         background-color: $color;
//     }
// }
</style>
