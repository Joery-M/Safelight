<template>
    <button
        role="button"
        :aria-label="alt"
        :class="{
            ['btn-' + (size ?? 'md')]: true,
            ['btn-type-' + type]: type,
            'btn-active': active,
            'btn-circle': circle || (loading && !$slots.default && !square),
            'btn-outline': outline,
            'btn-square': square,
            'btn-wide': wide
        }"
        class="btn"
        :disabled="disabled"
        v-bind="$attrs"
        @click="
            (p) => {
                if (to) {
                    $router.push(to);
                } else {
                    $emit('click', p);
                }
            }
        "
        @dblclick="(p) => $emit('dblclick', p)"
        @auxclick="(p) => $emit('auxclick', p)"
    >
        <div v-if="loading || $slots.icon" class="btn-icon relative inline-block size-6">
            <Transition>
                <div v-if="loading">
                    <PhCircleNotch class="animate-spin" />
                </div>
                <div v-else-if="$slots.icon">
                    <component :is="$slots.icon" />
                </div>
            </Transition>
        </div>
        <span
            :class="{
                'ml-2': (loading || $slots.icon) && $slots.default
            }"
        >
            <component :is="$slots.default" />
        </span>
    </button>
</template>

<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue';

defineSlots<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default(): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon(): any;
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
    to?: string;
    alt?: string;
    type?: 'success' | 'fail' | 'warning';
}>();

defineEmits<{
    click: [payload: MouseEvent];
    dblclick: [payload: MouseEvent];
    auxclick: [payload: MouseEvent];
}>();
</script>

<style lang="scss" scoped>
.btn {
    @apply m-1 inline-flex items-center justify-center
            overflow-y-hidden rounded-md border-none align-middle
            text-white transition-all active:transition-none;

    /* Sizes */
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
        width: calc(100% - 0.5rem);
    }
    &.btn-square {
        @apply aspect-square;
    }
    &.btn-circle {
        @apply aspect-square rounded-full;
    }

    /* States */

    &:not(.btn-outline) {
        @apply bg-neutral-700 hover:bg-surface-600 active:bg-surface-400 active:text-surface-950;
    }
    &.btn-outline {
        @apply border border-solid border-neutral-700
               bg-transparent hover:border-neutral-400 hover:bg-transparent
               active:border-neutral-500 active:bg-transparent active:text-neutral-400;
    }
    &.btn-active {
        @apply bg-surface-300 text-surface-950;
    }
    &:disabled {
        @apply bg-neutral-700 text-neutral-500 hover:bg-neutral-700 active:text-neutral-500;
    }

    &.btn-type-success:not(:disabled) {
        @apply bg-green-700 hover:bg-green-600 active:bg-green-400;
    }
    &.btn-type-fail:not(:disabled) {
        @apply bg-red-700 hover:bg-red-600 active:bg-red-400;
    }
    &.btn-type-warning:not(:disabled) {
        @apply bg-amber-700 hover:bg-amber-600 active:bg-amber-400;
    }

    .btn-icon > div {
        position: absolute;
    }
}

.v-enter-active,
.v-leave-active {
    @apply transition-transform duration-500;
    transform: translateY(0);
}

.v-enter-from {
    @apply translate-y-10;
}
.v-leave-to {
    @apply -translate-y-10;
}
</style>

<style>
.btn > .btn-icon > div > svg,
.btn > span > svg {
    @apply size-6;
}
</style>
