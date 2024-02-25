<template>
    <div class="timeline">
        <div
            ref="timelineContainer"
            v-bind="$attrs"
            class="timeline-container"
            @pointerdown="dragStart"
            @pointermove="dragging"
            @pointerup="dragEnd()"
            @pointerup.self="if (selectionDragStarted && !selectionDrag) selectedItems = [];"
        >
            <Teleport to="body">
                <div
                    v-show="selectionDrag"
                    id="selection-box"
                    :style="{
                        left:
                            Math.min(selectionBox.x1, selectionBox.x2) +
                            useProjection(scrollOffsetX).value +
                            containerBoundingBox.x.value +
                            'px',
                        top:
                            Math.min(selectionBox.y1, selectionBox.y2) +
                            containerBoundingBox.y.value +
                            'px',
                        width:
                            Math.max(selectionBox.x1, selectionBox.x2) -
                            Math.min(selectionBox.x1, selectionBox.x2) +
                            'px',
                        height:
                            Math.max(selectionBox.y1, selectionBox.y2) -
                            useMin(
                                Math.min(selectionBox.y1, selectionBox.y2),
                                containerBoundingBox.height
                            ).value +
                            'px'
                    }"
                />
            </Teleport>
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
            <!-- eslint-disable-next-line vue/no-useless-template-attributes -->
            <template v-for="(item, itemI) in items" :key="itemI">
                <div
                    v-if="item.start < scrollOffsetX + end && item.end > scrollOffsetX"
                    ref="itemElements"
                    class="timeline-item"
                    :class="{
                        ['num-' + itemI]: true,
                        selected: useArrayIncludes(selectedItems, item).value
                    }"
                    :style="{
                        left: useProjection(item.start).value + 'px',
                        top:
                            containerBoundingBox.height.value - rowHeight * (item.layer + 1) + 'px',
                        height: rowHeight + 'px',
                        width:
                            useProjection(item.end).value - useProjection(item.start).value + 'px'
                    }"
                    @click="toggleSelect(item)"
                >
                    <p>{{ item.title }} {{ item.layer }}</p>
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
const availableRowsWithoutOverflow = ref(0);

const items = defineModel<TimelineComponentItem[]>({
    default: [],
    set(v) {
        return v.map((i) => ({
            start: i.start,
            end: i.end,
            isGhost: i.isGhost,
            layer: i.layer,
            title: i.title
        }));
    }
});
const start = defineModel<number>('start', { default: 0 });
const end = defineModel<number>('end', { default: 120 });
const selectedItems = ref<TimelineComponentItem[]>([]);

const selectionDrag = ref(false);
const selectionDragStarted = ref(false);
const selectionBox = reactive({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
});

const viewRange = ref<[number, number]>([0, end.value]);
const timelineContainer = ref<HTMLDivElement>();
const containerSizeRange = ref<[number, number]>([0, 100]);
const containerBoundingBox = useElementBounding(timelineContainer);

watch([end, items], () => {
    viewRange.value = [0, parseFloat(end.value.toString()) ?? 0];

    if (items.value && items.value.length > 0) {
        const last = items.value.sort((a, b) => b.end - a.end)[0];
        lastEnd.value = last.end;
    }
});

watchImmediate([containerBoundingBox.height, rowHeight], () => {
    availableRowsWithoutOverflow.value = containerBoundingBox.height.value / rowHeight.value;
});

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
    selectionDragStarted.value = true;
}

function dragging(ev: PointerEvent) {
    window.getSelection()?.removeAllRanges();

    if (selectionDragStarted.value) {
        selectionDrag.value = true;

        selectionBox.x2 = ev.x - containerBoundingBox.x.value;
        selectionBox.y2 = ev.y - containerBoundingBox.y.value;

        const x1 =
            useProjectionInverse(Math.min(selectionBox.x1, selectionBox.x2)).value +
            scrollOffsetX.value;
        const y1 = Math.min(selectionBox.y1, selectionBox.y2);
        const x2 =
            useProjectionInverse(Math.max(selectionBox.x2, selectionBox.x1)).value +
            scrollOffsetX.value;
        const y2 = Math.max(selectionBox.y2, selectionBox.y1);

        // Get all items that are in the range
        selectedItems.value = items.value.filter((item) => {
            const itemY = containerBoundingBox.height.value - (item.layer + 1) * rowHeight.value;

            const isInHorizontalRange = item.start > x2 || item.end < x1;
            const isInVerticalRange = itemY > y2 || itemY + rowHeight.value < y1;

            return !(isInHorizontalRange || isInVerticalRange);
        });
    }
}

function dragEnd() {
    nextTick(() => {
        selectionDragStarted.value = false;
        selectionDrag.value = false;
    });
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
    @apply absolute select-none border-0 border-accent-700 bg-accent-900
        transition-all duration-75 hover:z-10 hover:border-2;

    transition-property: border;

    &.selected {
        @apply border-2 border-accent-500;
    }
}

#selection-box {
    @apply fixed z-20 select-none border-2 fill-base-700 opacity-100;
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
