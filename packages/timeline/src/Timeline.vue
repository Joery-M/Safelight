<template>
    <Splitter id="horizontalContainer">
        <SplitterPanel id="layerControls" :min-size="2" :size="10">
            <template v-for="i in viewport.highestLayer.value + 1" :key="i">
                <LayerControl ref="layerControls" :layer="i - 1" />
            </template>
        </SplitterPanel>
        <SplitterPanel id="verticalContainer" :size="90" style="position: relative">
            <TimeBar ref="timeBar" />
            <PlaybackHead v-if="viewport.pbPos.value !== undefined" ref="pbHead" />
            <div id="timelineItemContainer" ref="target">
                <template v-for="item in items" :key="item.id">
                    <TimelineItemComponent
                        v-if="viewport.isItemVisible(item)"
                        :item="item"
                        @item-change="updateItem"
                    />
                </template>
            </div>
            <div class="scrollbarContainer horizontal">
                <div
                    ref="horizontalScroll"
                    :style="{
                        left: scrollbarLeft + '%',
                        width: scrollbarWidth + '%'
                    }"
                    @mousedown="startResize"
                ></div>
            </div>
        </SplitterPanel>
    </Splitter>
</template>

<script setup lang="ts">
import { useElementBounding, useEventListener, watchImmediate } from '@vueuse/core';
import { useWheel } from '@vueuse/gesture';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { computed, provide, ref, watchEffect } from 'vue';
import { TimelineViewport, type TimelineItem, type TimelineProps } from './index';
import LayerControl from './LayerControl.vue';
import PlaybackHead from './PlaybackHead.vue';
import TimeBar from './TimeBar.vue';
import TimelineItemComponent from './TimelineItemComponent.vue';

const target = ref<HTMLDivElement>();
const horizontalScroll = ref<HTMLDivElement>();
const pointerOut = ref(true);

useEventListener(['mousemove', 'mouseenter', 'mouseover'], (ev) => {
    if (ev.target) {
        pointerOut.value = !target.value?.parentNode?.contains(ev.target as Node);
    }
});

const props = withDefaults(defineProps<TimelineProps>(), {
    alignment: 'bottom',
    zoomFactor: 2,
    invertScrollAxes: false,
    invertHorizontalScroll: false,
    invertVerticalScroll: false,
    playbackPosition: undefined
});

const items = defineModel<{ [id: string]: TimelineItem }>('items', {
    default: {},
    required: true
});

const playbackPosition = defineModel<number | undefined>('playbackPosition', {
    default: undefined,
    required: false
});

const layerControls = ref<(typeof LayerControl)[]>([]);
const pbHead = ref<typeof PlaybackHead>();
const timeBar = ref<typeof TimeBar>();

const viewport = new TimelineViewport();

viewport.pbPos = playbackPosition;

provide('viewport', viewport);

watchEffect(() => {
    viewport.alignment.value = props.alignment;
    viewport.zoomFactor.value = props.zoomFactor;
    viewport.fps.value = props.fps ?? Infinity;
});

watchImmediate(items.value, () => {
    // get the max duration of all items
    viewport.maxTime.value = Math.max(
        ...Object.values(items.value).map((i) => i.duration + i.start)
    );

    // Get the highest layer of all items
    viewport.highestLayer.value = Math.max(...Object.values(items.value).map((i) => i.layer));
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
            const mouseX = ev.event.clientX - bounds.left.value;
            const mouseXPerc = mouseX / bounds.width.value;
            viewport.zoom(ev.delta[1], mouseXPerc);
        } else {
            // Scrolling
            const shift = props.invertScrollAxes ? !ev.shiftKey : ev.shiftKey;
            const invertY = props.invertVerticalScroll ? -1 : 1;
            const invertX = props.invertHorizontalScroll ? -1 : 1;
            if (shift) {
                viewport.moveY(ev.delta[1] * invertY);
                viewport.move(ev.delta[0] * invertX);
            } else {
                viewport.moveY(ev.delta[0] * invertY);
                viewport.move(ev.delta[1] * invertX);
            }
        }
    },
    {
        domTarget: target
    }
);
//#endregion

//#region Items

function updateItem(newItem: TimelineItem) {
    items.value[newItem.id] = newItem;
}

//#endregion

//#region Scrollbar

const scrollbarLeft = computed(
    () => (viewport.startTime.value / (viewport.maxTime.value + viewport.endPadding)) * 100
);
const scrollbarWidth = computed(
    () =>
        ((viewport.endTime.value - viewport.startTime.value) /
            (viewport.maxTime.value + viewport.endPadding)) *
        100
);

useEventListener('mousemove', resizing);
useEventListener('mouseup', endResize);

const isHoldingHorizontal = ref(false);
const horizontalLastX = ref(0);

function startResize(ev: MouseEvent) {
    isHoldingHorizontal.value = true;
    horizontalLastX.value = ev.clientX;
}

function resizing(ev: MouseEvent) {
    layerControls.value.forEach((lc) => lc.resizing(ev));
    pbHead.value?.moving(ev);
    timeBar.value?.moving(ev);

    if (isHoldingHorizontal.value) {
        window.getSelection()?.removeAllRanges();
        // Feels hacky, but it works
        viewport.move(viewport.getTimePosition(ev.clientX - horizontalLastX.value) * 2.175);
        horizontalLastX.value = ev.clientX;
    }
}
function endResize(ev: MouseEvent) {
    layerControls.value.forEach((lc) => lc.endResize(ev));
    pbHead.value?.endMove();
    timeBar.value?.endMove();

    if (isHoldingHorizontal.value) {
        isHoldingHorizontal.value = false;
    }
}
//#endregion
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

    scroll-behavior: smooth;
}

#layerControls {
    position: relative;
}

// TODO: Add background
// #backgroundContainer {
//     position: relative;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;

//     pointer-events: none;
//     touch-action: none;
// }

// TODO: Add scrollbars
.scrollbarContainer {
    background-color: color.change(white, $alpha: 0.05);
    overflow: hidden;
    position: relative;

    &.horizontal {
        height: 0.25rem;
    }

    &.vertical {
        width: 0.25rem;
    }

    > div {
        background-color: color.change(white, $alpha: 0.5);
        border-radius: 0.25rem;
        height: 100%;
        position: absolute;
    }
}
</style>
