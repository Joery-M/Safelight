<template>
    <button
        @click="(p) => $emit('click', p)"
        @dblclick="(p) => $emit('dblclick', p)"
        @auxclick="(p) => $emit('auxclick', p)"
        class="btn"
        :class="{
            ['btn-' + type]: type,
            ['btn-' + (size ?? 'md')]: size,
            glass,
            'no-animation': noAnimation,
            'btn-active': active,
            'btn-block': block,
            'btn-circle': circle,
            'btn-outline': outline,
            'btn-square': square,
            'btn-wide': wide
        }"
        :disabled="disabled"
    >
        <span class="loading loading-spinner" v-if="loading" />
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    type?:
        | 'primary'
        | 'secondary'
        | 'neutral'
        | 'accent'
        | 'info'
        | 'success'
        | 'warning'
        | 'error'
        | (string & {});
    ghost?: boolean;
    link?: boolean;
    active?: boolean;
    outline?: boolean;
    size?: 'lg' | 'md' | 'sm' | 'xs' | (string & {});
    wide?: boolean;
    block?: boolean;
    glass?: boolean;
    disabled?: boolean;
    square?: boolean;
    circle?: boolean;
    icon?: string;
    loading?: boolean;
    noAnimation?: boolean;
    iconPrepend?: string;
    iconAppend?: string;
}>();

defineEmits<{
    click: [payload: MouseEvent];
    dblclick: [payload: MouseEvent];
    auxclick: [payload: MouseEvent];
}>();
</script>
