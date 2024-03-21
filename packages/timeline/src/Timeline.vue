<template>
    <div id="horizontalContainer">
        <div id="verticalContainer">
            <div id="timelineItemContainer" ref="target">
                <template v-for="item in props.items" :key="item.id">
                    <TimelineItemComponent
                        :item="item"
                        :viewport="viewport"
                        @item-change="updateItem"
                    />
                </template>
                <div id="backgroundContainer">
                    <div
                        class="verticalBars"
                        :style="{
                            '--start':
                                viewport.millisecondsToX(nearestTenth(viewport.viewWidth.value, 1))
                                    .value + 'px',
                            '--gap':
                                viewport.millisecondsToXNoOffset(
                                    nearestTenth(viewport.viewWidth.value, 1)
                                ).value + 'px'
                        }"
                    />
                </div>
            </div>
        </div>
    </div>
    <p>{{ useRound(viewport.xToMilliseconds(0)) }}</p>
    <p>{{ useRound(viewport.xToMilliseconds(viewport.boundingBoxWidth)) }}</p>
    <p>{{ useRound(viewport.viewWidth) }}</p>
    <p>{{ useRound(viewport.lastMs) }}</p>
    <p>{{ useRound(viewport.millisecondsToXNoOffset(viewport.x)) }} px</p>
    <p>{{ useRound(bounds.width) }} px</p>
</template>

<script setup lang="ts">
import {
    useElementBounding,
    useEventListener,
    useMouseInElement,
    useVModel,
    watchImmediate
} from '@vueuse/core';
import { useWheel } from '@vueuse/gesture';
import { useRound } from '@vueuse/math';
import { ref, watch } from 'vue';
import TimelineItemComponent from './TimelineItemComponent.vue';
import { TimelineViewport, type TimelineAlignment, type TimelineItem } from './index';

const target = ref<HTMLDivElement>();
// const YScrollbar = ref<HTMLDivElement>();
// const XScrollbar = ref<HTMLDivElement>();
const pointerOut = useMouseInElement(target).isOutside;

const props = withDefaults(
    defineProps<{
        items: { [id: string]: TimelineItem };
        alignment?: TimelineAlignment;
        zoomFactor?: number;
    }>(),
    {
        items: () => ({}),
        alignment: 'bottom',
        zoomFactor: 1.02
    }
);

const emit = defineEmits<{
    'update:modelValue': any[];
}>();

const items = useVModel(props, 'items', emit);

const viewport = new TimelineViewport();

watch(props, () => {
    viewport.alignment.value = props.alignment;
});

watchImmediate(items.value, () => {
    // get the max duration of all items
    viewport.lastMs.value = Math.max(
        ...Object.values(items.value).map((i) => i.duration + i.start)
    );
});

//#region Scrolling/Zooming

// Prevent browser zooming
useEventListener(
    'wheel',
    (ev) => {
        if (!pointerOut.value) {
            ev.preventDefault();
        }
    },
    { passive: false }
);

const isScrolling = ref(false);

const bounds = useElementBounding(target);
viewport.boundingBoxHeight = bounds.height;
viewport.boundingBoxWidth = bounds.width;

useWheel(
    (ev) => {
        isScrolling.value = ev.scrolling;

        if (ev.ctrlKey) {
            // Zooming
            if (ev.delta[1] > 0) {
                const oldScale = viewport.scaleX.value;
                viewport.scaleX.value *= props.zoomFactor;
                const mousePos = viewport.xToMilliseconds(ev.event.clientX).value; // get the current mouse position
                const currentX = viewport.x.value;
                const newScaleX = viewport.scaleX.value;
                viewport.x.value = Math.max(
                    0,
                    mousePos + ((currentX - mousePos) / oldScale) * newScaleX
                );
            } else if (ev.delta[1] < 0) {
                if (viewport.scaleX.value / props.zoomFactor > 0.01) {
                    const oldScale = viewport.scaleX.value;
                    viewport.scaleX.value /= props.zoomFactor;
                    const mousePos = viewport.xToMilliseconds(ev.event.clientX).value; // get the current mouse position
                    const currentX = viewport.x.value;
                    const newScaleX = viewport.scaleX.value;
                    viewport.x.value = Math.max(
                        0,
                        mousePos + ((currentX - mousePos) / oldScale) * newScaleX
                    );
                }
            }
        } else {
            // Scrolling
            viewport.pan(ev.delta[0], ev.delta[1], ev.shiftKey);
        }
    },
    {
        domTarget: target
    }
);
//#endregion

//#region Items

watch(props.items, () => {
    console.log(props.items);
});

function updateItem(newItem: TimelineItem) {
    items.value[newItem.id] = newItem;
}

//#endregion

function nearestTenth(v: number, offset: number = 0) {
    return Math.pow(10, Math.floor(Math.log10(v)) - offset);
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

#horizontalContainer {
    display: flex;
}
#verticalContainer {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
#timelineItemContainer {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    min-height: 250px;
}

#backgroundContainer {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    pointer-events: none;
    touch-action: none;

    .verticalBars {
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        position: absolute;

        $stripeColor: color.change(white, $alpha: 1);
        $stripeColor2: color.change(white, $alpha: 1);

        background-image: repeating-linear-gradient(
            90deg,
            transparent var(--start),
            transparent calc(var(--gap) + var(--start)),
            $stripeColor calc(var(--gap) + var(--start)),
            transparent calc(var(--gap) + var(--start))
        );
    }
}

// TODO: Add scrollbars
// .scrollbarContainer {
//     background-color: color.change(white, $alpha: 0.05);
//     overflow: hidden;

//     &.horizontal {
//         height: 0.5rem;
//     }

//     &.vertical {
//         width: 0.5rem;
//     }

//     > div {
//         background-color: color.change(white, $alpha: 0.5);
//         border-radius: 0.25rem;
//         height: 100%;
//     }
// }
</style>
