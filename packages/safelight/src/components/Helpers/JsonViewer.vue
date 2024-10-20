<template>
    <div class="wrapper">
        <div ref="wrapper"></div>
    </div>
</template>

<script setup lang="ts">
import LunaObjectViewer from 'luna-object-viewer';
import { onMounted, ref, toRaw, watchEffect } from 'vue';

const props = defineProps<{ data: any }>();

const wrapper = ref<HTMLDivElement>();

onMounted(() => {
    if (!wrapper.value) return;

    const viewer = new LunaObjectViewer(wrapper.value, {
        accessGetter: false,
        prototype: false,
        theme: 'dark'
    });
    watchEffect(() => {
        viewer.set(toRaw(props.data));
    });
});
</script>

<style lang="scss" scoped>
:deep() {
    .luna-object-viewer-icon-caret-down:before {
        content: '\2B9F';
    }
    .luna-object-viewer-icon-caret-right:before {
        content: '\2B9E';
    }
    .luna-object-viewer {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        overflow-y: hidden;
        cursor: default;
        font-family:
            ui-monospace,
            SFMono-Regular,
            SF Mono,
            Menlo,
            Consolas,
            Liberation Mono,
            monospace;
        font-size: 12px;
        line-height: 1.2;
        min-height: 100%;
        color: #333;
        list-style: none !important;
    }
    .luna-object-viewer ul {
        list-style: none !important;
        padding: 0 !important;
        padding-left: 12px !important;
        margin: 0 !important;
    }
    .luna-object-viewer li {
        position: relative;
        white-space: nowrap;
        line-height: 16px;
        min-height: 16px;
    }
    .luna-object-viewer > li > .luna-object-viewer-key {
        display: none;
    }
    .luna-object-viewer span {
        position: static !important;
    }
    .luna-object-viewer li .luna-object-viewer-collapsed ~ .luna-object-viewer-close:before {
        color: #999;
    }
    .luna-object-viewer-array .luna-object-viewer-object .luna-object-viewer-key {
        display: inline;
    }
    .luna-object-viewer-null {
        color: #5e5e5e;
    }
    .luna-object-viewer-regexp {
        color: var(--p-red-500);
    }
    .luna-object-viewer-string {
        color: var(--p-violet-500);
    }
    .luna-object-viewer-number {
        color: var(--p-blue-500);
    }
    .luna-object-viewer-boolean {
        color: #0d22aa;
    }
    .luna-object-viewer-open {
        color: var(--p-neutral-500);
    }
    .luna-object-viewer-key + .luna-object-viewer-open {
        color: var(--p-neutral-600);
    }
    .luna-object-viewer-special {
        color: var(--p-sky-500);
    }
    .luna-object-viewer-key,
    .luna-object-viewer-key-lighter {
        color: var(--p-text-color);
    }
    .luna-object-viewer-key-lighter {
        opacity: 0.6;
    }
    .luna-object-viewer-key-special {
        color: #5e5e5e;
    }
    .luna-object-viewer-collapsed .luna-object-viewer-icon,
    .luna-object-viewer-expanded .luna-object-viewer-icon {
        position: absolute !important;
        left: -12px;
        color: #727272;
        font-size: 12px;
    }
    .luna-object-viewer-icon-caret-right {
        top: 0;
    }
    .luna-object-viewer-icon-caret-down {
        top: 1px;
    }
    .luna-object-viewer-expanded > .luna-object-viewer-icon-caret-down {
        display: inline;
    }
    .luna-object-viewer-expanded > .luna-object-viewer-icon-caret-right {
        display: none;
    }
    .luna-object-viewer-collapsed > .luna-object-viewer-icon-caret-down {
        display: none;
    }
    .luna-object-viewer-collapsed > .luna-object-viewer-icon-caret-right {
        display: inline;
    }
    .luna-object-viewer-hidden ~ ul {
        display: none;
    }
    .luna-object-viewer-theme-dark {
        color: #fff;
    }
    .luna-object-viewer-theme-dark .luna-object-viewer-null,
    .luna-object-viewer-theme-dark .luna-object-viewer-special {
        color: #a1a1a1;
    }
    .luna-object-viewer-theme-dark .luna-object-viewer-regexp,
    .luna-object-viewer-theme-dark .luna-object-viewer-string {
        color: #f28b54;
    }
    .luna-object-viewer-theme-dark .luna-object-viewer-boolean,
    .luna-object-viewer-theme-dark .luna-object-viewer-number {
        color: #9980ff;
    }
    .luna-object-viewer-theme-dark .luna-object-viewer-key,
    .luna-object-viewer-theme-dark .luna-object-viewer-key-lighter {
        color: #5db0d7;
    }
}
</style>
