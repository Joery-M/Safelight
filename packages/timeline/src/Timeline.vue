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
            </div>
            <div class="scrollbarContainer horizontal">
                <div ref="XScrollbar" />
            </div>
        </div>
        <div class="scrollbarContainer vertical">
            <div ref="YScrollbar" />
        </div>
    </div>
    {{ viewport.xToMilliseconds(0) }}
    {{ viewport.xToMilliseconds(viewport.boundingBoxWidth) }}
</template>

<script setup lang="ts">
import { useEventListener, useMouseInElement, useVModel } from '@vueuse/core';
import { useWheel } from '@vueuse/gesture';
import { ref, watch } from 'vue';
import TimelineItemComponent from './TimelineItemComponent.vue';
import { TimelineViewport, type TimelineAlignment, type TimelineItem } from './index';

const target = ref<HTMLDivElement>();
const YScrollbar = ref<HTMLDivElement>();
const XScrollbar = ref<HTMLDivElement>();
const pointerOut = useMouseInElement(target, {}).isOutside;

const props = withDefaults(
    defineProps<{
        items: { [id: string]: TimelineItem };
        alignment?: TimelineAlignment;
    }>(),
    {
        items: () => ({}),
        alignment: 'bottom'
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

//#region Zooming

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

//#endregion

//#region Scrolling

useWheel(
    (ev) => {
        isScrolling.value = ev.scrolling;

        if (ev.ctrlKey) {
            if (ev.delta[1] > 0) {
                if (viewport.scaleX.value * 1.5 < 150) {
                    viewport.scaleX.value *= 1.5;
                }
            } else if (ev.delta[1] < 0) {
                if (viewport.scaleX.value / 1.5 > 0.01) {
                    viewport.scaleX.value /= 1.5;
                }
            }
        } else if (ev.shiftKey) {
            viewport.x.value += ev.delta[1];
            viewport.x.value = Math.max(0, viewport.x.value);
            if (viewport.alignment.value == 'bottom') {
                viewport.y.value -= ev.delta[0];
                viewport.y.value = Math.max(0, viewport.y.value);
            } else {
                viewport.y.value += ev.delta[0];
                viewport.y.value = Math.max(0, viewport.y.value);
            }
        } else {
            viewport.x.value += ev.delta[0];
            viewport.x.value = Math.max(0, viewport.x.value);
            if (viewport.alignment.value == 'bottom') {
                viewport.y.value -= ev.delta[1];
                viewport.y.value = Math.max(0, viewport.y.value);
            } else {
                viewport.y.value += ev.delta[1];
                viewport.y.value = Math.max(0, viewport.y.value);
            }
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

.scrollbarContainer {
    background-color: color.change(white, $alpha: 0.05);

    &.horizontal {
        height: 0.5rem;
    }

    &.vertical {
        width: 0.5rem;
    }
}
</style>
