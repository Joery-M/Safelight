<script lang="ts" setup>
// Copied from Histoire, since i was looking for a good way to do splitters,
// and it just so happened that i stumbled upon their implementation whilst looking for drag elements
// Go give them a star if you see this
// https://github.com/histoire-dev/histoire

import { ref, computed, watch, onUnmounted, type StyleValue } from 'vue';

const props = defineProps({
    orientation: {
        type: String,
        default: 'landscape',
        validator: (value: string) => ['landscape', 'portrait'].includes(value)
    },

    defaultSplit: {
        type: Number,
        default: 50
    },

    split: {
        type: Number,
        default: undefined
    },

    min: {
        type: Number,
        default: 20
    },

    max: {
        type: Number,
        default: 80
    },

    draggerOffset: {
        type: String,
        default: 'center',
        validator: (value: string) => ['before', 'center', 'after'].includes(value)
    },

    saveId: {
        type: String,
        default: null
    },

    fixed: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits<{
    (e: 'update:split', value: number): true;
}>();

const currentSplit = ref(props.defaultSplit);

watch(
    () => props.split,
    (value) => {
        if (value !== undefined) {
            currentSplit.value = value;
        }
    },
    {
        immediate: true
    }
);

if (props.saveId) {
    const storageKey = `split-pane-${props.saveId}`;

    const savedValue = localStorage.getItem(storageKey);
    if (savedValue != null) {
        let parsedValue;
        try {
            parsedValue = JSON.parse(savedValue);
        } catch (e) {
            console.error(e);
        }

        if (typeof parsedValue === 'number') {
            currentSplit.value = parsedValue;
        }
    }

    watch(currentSplit, (value) => {
        localStorage.setItem(storageKey, JSON.stringify(value));
    });

    watch(
        currentSplit,
        (value) => {
            if (value !== props.split) {
                emit('update:split', value);
            }
        },
        {
            immediate: true
        }
    );
}

const boundSplit = computed(() => {
    if (currentSplit.value < props.min) {
        return props.min;
    } else if (currentSplit.value > props.max) {
        return props.max;
    } else {
        return currentSplit.value;
    }
});

const leftStyle = computed(() => ({
    [props.orientation === 'landscape' ? 'width' : 'height']: props.fixed
        ? `${boundSplit.value}px`
        : `${boundSplit.value}%`
}));

const rightStyle = computed(() => ({
    [props.orientation === 'landscape' ? 'width' : 'height']: props.fixed
        ? null
        : `${100 - boundSplit.value}%`
}));

const dragging = ref(false);
let startPosition = 0;
let startSplit = 0;
const el = ref<HTMLDivElement>();

function dragStart(e: MouseEvent) {
    dragging.value = true;
    startPosition = props.orientation === 'landscape' ? e.pageX : e.pageY;
    startSplit = boundSplit.value;
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
}

function dragMove(e: MouseEvent) {
    if (dragging.value && el.value) {
        let position;
        let totalSize;
        if (props.orientation === 'landscape') {
            position = e.pageX;
            totalSize = el.value.offsetWidth;
        } else {
            position = e.pageY;
            totalSize = el.value.offsetHeight;
        }
        const dPosition = position - startPosition;
        if (props.fixed) {
            currentSplit.value = startSplit + dPosition;
        } else {
            currentSplit.value = startSplit + ~~((dPosition / totalSize) * 200) / 2;
        }
    }
}

function dragEnd() {
    dragging.value = false;
    removeDragListeners();
}

function removeDragListeners() {
    window.removeEventListener('mousemove', dragMove);
    window.removeEventListener('mouseup', dragEnd);
}

onUnmounted(() => {
    removeDragListeners();
});
</script>

<template>
    <div
        ref="el"
        class="flex h-full isolate overflow-auto"
        :class="{
            'flex-col': orientation === 'portrait',
            'cursor-ew-resize': dragging && orientation === 'landscape',
            'cursor-ns-resize': dragging && orientation === 'portrait',
            [orientation]: true
        }"
    >
        <div
            class="relative top-0 left-0 z-20"
            :class="{
                'pointer-events-none': dragging,
                'border-r border-gray-300/30 dark:border-gray-800': orientation === 'landscape',
                'flex-none': fixed
            }"
            :style="leftStyle"
        >
            <slot name="first" />

            <div
                class="dragger absolute z-100 hover:bg-primary/25 transition-colors duration-150 delay-150"
                :class="{
                    'top-0 bottom-0 cursor-ew-resize': orientation === 'landscape',
                    'left-0 right-0 cursor-ns-resize': orientation === 'portrait',
                    [`dragger-offset-${draggerOffset}`]: true,
                    'bg-primary/25': dragging
                }"
                @mousedown.prevent="dragStart"
            />
        </div>
        <div
            class="relative bottom-0 right-0"
            :class="{
                'pointer-events-none': dragging,
                'border-t border-gray-300/30 dark:border-gray-800': orientation === 'portrait',
                'flex-1': fixed
            }"
            :style="rightStyle as StyleValue"
        >
            <slot name="last" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.landscape > div > .dragger {
    width: 0.3125rem;
}

.portrait > div > .dragger {
    height: 0.3125rem;
}

.landscape > div > .dragger.dragger-offset-before {
    right: 0;
}

.portrait > div > .dragger.dragger-offset-before {
    bottom: 0;
}

.landscape > div > .dragger.dragger-offset-center {
    right: -0.15625rem;
}

.portrait > div > .dragger.dragger-offset-center {
    bottom: -0.15625rem;
}

.landscape > div > .dragger.dragger-offset-after {
    right: -0.3125rem;
}

.portrait > div > .dragger.dragger-offset-after {
    bottom: -0.3125rem;
}
</style>
