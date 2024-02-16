<template>
    <button
        :class="{
            ['btn-' + (size ?? 'md')]: true,
            'btn-active': active,
            'btn-circle': circle || (loading && !slots.default && !square),
            'btn-outline': outline,
            'btn-square': square,
            'btn-wide': wide
        }"
        class="btn"
        :disabled="disabled"
        @click="(p) => $emit('click', p)"
        @dblclick="(p) => $emit('dblclick', p)"
        @auxclick="(p) => $emit('auxclick', p)"
    >
        <PhCircleNotch v-if="loading" class="inline-block size-5 animate-spin" />
        <span
            :class="{
                'ml-2': loading && slots.default
            }"
        >
            <component :is="slots.default" />
        </span>
    </button>
</template>

<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue';

const slots = defineSlots<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default(): any;
}>();

defineProps<{
    link?: boolean;
    active?: boolean;
    outline?: boolean;
    size?: 'xl' | 'lg' | 'md' | 'sm';
    wide?: boolean;
    disabled?: boolean;
    square?: boolean;
    circle?: boolean;
    loading?: boolean;
}>();

defineEmits<{
    click: [payload: MouseEvent];
    dblclick: [payload: MouseEvent];
    auxclick: [payload: MouseEvent];
}>();
</script>

<style lang="scss" scoped>
.btn {
    @apply m-1 inline-flex items-center
            justify-center rounded-md border-none
            text-white transition-all active:transition-none;

    &.btn-sm {
        @apply px-2.5 py-1;
    }
    &.btn-md {
        @apply px-2.5 py-2;
    }
    &.btn-lg {
        @apply px-3 py-3;
    }
    &.btn-xl {
        @apply px-4 py-4;
    }

    &.btn-wide {
        width: 100%;
    }
    &.btn-square {
        @apply aspect-square;
    }

    &:not(.btn-outline) {
        @apply bg-neutral-700 hover:bg-base-600 active:bg-base-300 active:text-base-950;
    }
    &.btn-outline {
        @apply border border-solid border-neutral-700
               bg-transparent hover:border-neutral-400 hover:bg-transparent
               active:border-neutral-500 active:bg-transparent active:text-neutral-400;
    }

    &.btn-circle {
        @apply aspect-square rounded-full;
    }

    &.btn-active {
        @apply bg-base-300 text-base-950;
    }

    &:disabled {
        @apply bg-neutral-700 text-neutral-500 hover:bg-neutral-700 active:text-neutral-500;
    }
}
</style>

<style>
.btn > span > svg {
    @apply size-5;
}
</style>
