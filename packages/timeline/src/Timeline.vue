<template>
    <div
        id="container"
        ref="target"
        @pointerover="targetPointerOver = true"
        @pointerout="targetPointerOver = false"
    >
        <template v-for="item in props.items" :key="item.id">
            <TimelineItemComponent :item="item" :viewport="viewport" @item-change="updateItem" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { useEventListener, useVModel } from '@vueuse/core';
import { usePinch, useWheel } from '@vueuse/gesture';
import { ref, watch } from 'vue';
import TimelineItemComponent from './TimelineItemComponent.vue';
import { TimelineViewport, type TimelineItem } from './index';

const target = ref<HTMLDivElement>();
const targetPointerOver = ref(false);

const props = withDefaults(
    defineProps<{
        items: { [id: string]: TimelineItem };
    }>(),
    {
        items: () => ({})
    }
);

const emit = defineEmits<{
    'update:modelValue': any[];
}>();

const items = useVModel(props, 'items', emit);

const viewport = new TimelineViewport();

//#region Zooming

// Prevent browser zooming
useEventListener(
    'wheel',
    (ev) => {
        if (targetPointerOver.value) {
            ev.preventDefault();
        }
    },
    { passive: false }
);

const isPinching = ref(false);
const isScrolling = ref(false);

usePinch(
    (ev) => {
        if (!isScrolling.value) {
            isPinching.value = ev.pinching;

            viewport.scaleX.value += ev.delta[1] / 200;
            viewport.scaleX.value = Math.max(0.1, viewport.scaleX.value);
        }
    },
    {
        domTarget: target
    }
);

//#endregion

//#region Scrolling
useWheel(
    (ev) => {
        if (!isPinching.value) {
            isScrolling.value = ev.scrolling;

            viewport.x.value += ev.delta[0];
            viewport.x.value = Math.max(0, viewport.x.value);
            viewport.y.value += ev.delta[1];
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
#container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    min-height: 250px;
}
</style>
