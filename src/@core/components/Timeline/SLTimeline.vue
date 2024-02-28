<template>
    <div
        class="timeline"
        :style="{
            '--marginLeft': marginLeft + 'px'
        }"
    >
        <div class="timeline-layers">
            <template v-for="row in highestLayer + 1 + extraTopRows" :key="row">
                <div
                    v-if="isRowVisible(row - 1)"
                    class="timeline-layer-controls"
                    :class="{
                        odd: row % 2 == 1
                    }"
                    :style="{
                        width: '100%',
                        top: rowVerticalOffset(row - 1) - scrollOffsetY + 'px',
                        height: rowHeight + 'px'
                    }"
                >
                    <template v-if="row <= highestLayer + 1">
                        {{ row - 1 }}
                    </template>
                </div>
            </template>
        </div>
        <div class="timeline-background">
            <template v-for="row in highestLayer + 1 + extraTopRows" :key="row">
                <div
                    v-if="isRowVisible(row - 1)"
                    class="timeline-row"
                    :class="{
                        odd: row % 2 == 1
                    }"
                    :style="{
                        left: marginLeft + 'px',
                        top: rowVerticalOffset(row - 1) - scrollOffsetY + 'px',
                        height: rowHeight + 'px'
                    }"
                />
            </template>
        </div>
        <div
            ref="timelineContainer"
            v-bind="$attrs"
            class="timeline-container"
            @pointerdown="dragStart"
            @pointermove="dragging"
            @pointerup="dragEnd"
            @pointerup.self="if (selectionDragStarted && !selectionDrag) selectedItems = [];"
        >
            <div
                id="container-scroll-boundary"
                :style="{
                    width: useProjection(lastEnd).value + 'px',
                    height: (highestLayer + 1 + extraTopRows) * rowHeight + 'px',
                    top: 0
                }"
            />
            <template v-for="item in items" :key="item">
                <div
                    v-if="isItemVisible(item.start, item.end, item.layer)"
                    ref="itemElements"
                    class="timeline-item"
                    :class="{
                        selected: useArrayIncludes(selectedItems, item).value,
                        preselected: useArrayIncludes(preSelectedItems, item).value,
                    }"
                    :style="{
                        left: useProjection(item.start).value + 'px',
                        top: rowVerticalOffset(item.layer) + 'px',
                        height: rowHeight + 'px',
                        width:
                            useProjection(item.end).value - useProjection(item.start).value + 'px'
                    }"
                    @click="toggleSelect(item)"
                >
                    <p>{{ item.title }} {{ item.layer }} {{ Math.round(item.start) }}</p>
                </div>
            </template>
        </div>
        <Teleport to="body">
            <div
                v-if="selectionDrag"
                id="selection-box"
                :style="{
                    left:
                        Math.min(selectionBox.x1, selectionBox.x2) +
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
    </div>
</template>

<script lang="ts" setup>
const { rowHeight, extraTopRows } = withDefaults(
    defineProps<{
        cursor?: number;
        rowHeight?: number;
        extraTopRows?: number;
    }>(),
    {
        cursor: undefined,
        rowHeight: 32,
        extraTopRows: 1
    }
);

let scrollOffsetX = ref(0);
let scrollOffsetY = ref(0);
const highestLayer = ref(0);
const availableRowsWithoutOverflow = ref(0);
const lastEnd = ref(120);
const marginLeft = ref(64);

function isItemVisible(start: number, end: number, layer: number) {
    const isUnderTopOfView =
        layer - 1 < highestLayer.value + extraTopRows - scrollOffsetY.value / rowHeight;
    const isAboveBottomOfView =
        layer >
        highestLayer.value +
            extraTopRows -
            scrollOffsetY.value / rowHeight -
            availableRowsWithoutOverflow.value;
    const isHorizontallyInRange =
        start < scrollOffsetX.value + viewEnd.value && end > scrollOffsetX.value;

    return isUnderTopOfView && isAboveBottomOfView && isHorizontallyInRange;
}

function isRowVisible(row: number) {
    const isUnderTopOfView =
        row - 1 < highestLayer.value + extraTopRows - scrollOffsetY.value / rowHeight;
    const isAboveBottomOfView =
        row >
        highestLayer.value +
            extraTopRows -
            scrollOffsetY.value / rowHeight -
            availableRowsWithoutOverflow.value;

    return isUnderTopOfView && isAboveBottomOfView;
}

function rowVerticalOffset(row: number) {
    return (
        containerBoundingBox.height.value -
        rowHeight * (row - (highestLayer.value + extraTopRows - availableRowsWithoutOverflow.value))
    );
}

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
const viewStart = defineModel<number>('start', { default: 0 });
const viewEnd = defineModel<number>('end', { default: 120 });
const selectedItems = ref<TimelineComponentItem[]>([]);
const preSelectedItems = ref<TimelineComponentItem[]>([]);
const itemElements = ref<HTMLDivElement[]>([]);

const selectionDrag = ref(false);
const selectionDragStarted = ref(false);
const selectionBox = reactive({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
});

const viewRange = ref<[number, number]>([0, viewEnd.value]);
const timelineContainer = ref<HTMLDivElement>();
const containerSizeRange = ref<[number, number]>([0, 100]);
const containerBoundingBox = useElementBounding(timelineContainer);

watch([viewEnd, items], () => {
    viewRange.value = [0, parseFloat(viewEnd.value.toString()) ?? 0];

    if (items.value && items.value.length > 0) {
        const last = items.value.sort((a, b) => b.end - a.end)[0];
        lastEnd.value = last.end;
    }
});

watchImmediate([containerBoundingBox.height, toRef(rowHeight)], () => {
    availableRowsWithoutOverflow.value = containerBoundingBox.height.value / rowHeight;
});

onMounted(() => {
    const containerSize = useElementSize(timelineContainer);

    watchImmediate(containerSize.width, () => {
        containerSizeRange.value = [0, containerSize.width.value];
    });

    const scrolling = useScroll(timelineContainer);
    scrollOffsetX = useProjectionInverse(scrolling.x);
    scrollOffsetY = scrolling.y;

    watch(viewStart, () => {
        scrolling.x.value = useProjection(viewStart).value;
    });

    watch(scrolling.x, () => {
        viewStart.value = useProjectionInverse(scrolling.x.value).value;
    });

    watch(scrolling.y, () => {
        if (selectionDrag.value) {
            dragging();
        }
    });

    let hasSetScroll = false
    watch(
        items,
        () => {
            if (items.value.length > 0) {
                const highest = [...items.value].sort((a, b) => b.layer - a.layer)[0];
                highestLayer.value = highest.layer;

                const last = items.value.sort((a, b) => b.end - a.end)[0];
                lastEnd.value = last.end;

                if(!hasSetScroll && timelineContainer.value) {
                    setTimeout(()=>{
                        scrolling.y.value = (highestLayer.value + 1) * rowHeight
                    }, 1)
                    timelineContainer.value?.scrollTop
                    hasSetScroll = true
                }
            }
        },
        { immediate: true, deep: true }
    );
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
    const newStart = items.value.sort((a, b) => a.start - b.start)[0].start;
    viewEnd.value = items.value.sort((a, b) => b.end - a.end)[0].end - newStart;
    nextTick(() => {
        viewStart.value = newStart;
    });
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

function dragging(ev?: PointerEvent) {
    if (selectionDragStarted.value) {
        window.getSelection()?.removeAllRanges();
        selectionDrag.value = true;

        if (ev) {
            selectionBox.x2 = ev.x - containerBoundingBox.x.value;
            selectionBox.y2 = ev.y - containerBoundingBox.y.value;
        }

        // calculate the range in timeline space, then loop over all and check what is in said range
        const x1 =
            useProjectionInverse(Math.min(selectionBox.x1, selectionBox.x2)).value +
            scrollOffsetX.value;
        const y1 = Math.min(selectionBox.y1, selectionBox.y2);
        const x2 =
            useProjectionInverse(Math.max(selectionBox.x2, selectionBox.x1)).value +
            scrollOffsetX.value;
        const y2 = Math.max(selectionBox.y2, selectionBox.y1);

        // Get all items that are in the range
        preSelectedItems.value = items.value.filter((item) => {
            const itemY =
                (highestLayer.value + extraTopRows) * rowHeight -
                scrollOffsetY.value -
                item.layer * rowHeight;

            const isInHorizontalRange = item.start > x2 || item.end < x1;
            const isInVerticalRange = itemY > y2 || itemY + rowHeight < y1;

            return !(isInHorizontalRange || isInVerticalRange);
        });
    }
}

function dragEnd(ev: PointerEvent) {
    if (ev.ctrlKey) {
        selectedItems.value.push(...preSelectedItems.value);
    } else {
        selectedItems.value = preSelectedItems.value;
    }
    nextTick(() => {
        selectionDragStarted.value = false;
        selectionDrag.value = false;
    });
    preSelectedItems.value = [];
}

defineExpose({
    resizeToFitAll: fitAll
});
</script>

<style lang="scss" scoped>
.timeline {
    @apply relative flex overflow-clip;

    * {
        overscroll-behavior: none;
    }
}

.timeline-layers {
    @apply relative left-0 top-0 h-full overflow-clip overscroll-none;
    overscroll-behavior-block: contain;
    overscroll-behavior: none;
    width: var(--marginLeft);

    .timeline-layer-controls {
        @apply absolute select-none bg-accent-900 bg-opacity-40;

        &.odd {
            @apply bg-opacity-20;
        }
    }
}
.timeline-container {
    @apply relative left-0 top-0 h-full w-10 grow overflow-auto;

    #container-scroll-boundary {
        @apply pointer-events-none absolute bottom-0;
    }
}

.timeline-row {
    @apply pointer-events-none absolute w-full bg-base-900 opacity-20;

    &.odd {
        @apply opacity-100;
    }
}

.timeline-item {
    @apply absolute select-none bg-accent-900
        transition-all duration-100 hover:z-10;

    transition-property: border, background;

    &:hover {
        @apply bg-accent-800;
    }
    &.selected {
        @apply bg-accent-600 hover:bg-accent-500;
    }
    &.preselected {
        @apply bg-accent-600 ;
    }
}

#selection-box {
    @apply fixed z-20 select-none border-2 bg-base-700 opacity-20 pointer-events-none;
}
</style>
