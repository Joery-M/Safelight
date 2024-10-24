<template>
    <canvas ref="canvas" class="size-full"></canvas>
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import type { TimelineItem } from '@safelight/shared/base/TimelineItem';
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';
import { createTimelineManager, type CreateTimelineFn } from '@safelight/timeline';
import { TimelineCursorElement } from '@safelight/timeline/elements/TimelineCursorElement';
import { TimelineGrid } from '@safelight/timeline/elements/TimelineGrid';
import { TimelineLayer } from '@safelight/timeline/elements/TimelineLayer';
import { VideoTimelineElement } from '@safelight/timeline/elements/VideoTimelineElement';
import { syncRef, watchArray } from '@vueuse/core';
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    shallowReactive,
    watch,
    watchEffect
} from 'vue';

const project = useProject();
const projectTimeline = computed(() => project.p?.timeline.value);

const canvas = ref<HTMLCanvasElement>();

const invertScrollAxes = SettingsManager.getSetting<boolean>('editor.timeline.useTrackpad');
// const zoomFactor = SettingsManager.getSetting<number>('editor.timeline.zoomFactor');
// const alignment = SettingsManager.getSetting<'top' | 'bottom'>('editor.timeline.align');

const timelineManager = ref<CreateTimelineFn>();
onMounted(() => {
    if (canvas.value) {
        watch(
            projectTimeline,
            (projectTimeline, _old, onCleanup) => {
                if (!projectTimeline) {
                    return;
                }

                timelineManager.value = createTimelineManager(canvas.value!);

                const pbCursor = new TimelineCursorElement();
                const timelineGrid = new TimelineGrid();

                timelineManager.value!.addElement(pbCursor);
                timelineManager.value!.addElement(timelineGrid);

                onCleanup(() => {
                    timelineManager.value?.removeElement(pbCursor);
                    timelineManager.value?.removeElement(timelineGrid);
                });

                timelineGrid.steps.push(
                    {
                        interval: () => projectTimeline.frameDuration.value
                    },
                    {
                        interval: 100
                    },
                    {
                        interval: 1000
                    },
                    {
                        interval: 10000
                    }
                );

                watchEffect(() => {
                    if (projectTimeline) {
                        pbCursor.frameInterval.value = projectTimeline.frameDuration.value;
                    }
                });

                syncRef(pbCursor.cursorPos, projectTimeline.pbPos, {
                    transform: {
                        ltr: (val) => Math.round(val / projectTimeline.frameDuration.value),
                        rtl: (val) => val * projectTimeline.frameDuration.value
                    }
                });

                const layers = shallowReactive<TimelineLayer[]>([new TimelineLayer()]);

                onCleanup(() => {
                    const curLayers = Array.from(
                        timelineManager.value?.manager.layers.values() ?? []
                    );
                    for (const layer of curLayers) {
                        timelineManager.value?.removeLayer(layer);
                    }
                });

                watchArray(
                    layers,
                    (_cur, _old, added, removed) => {
                        for (const layer of added) {
                            timelineManager.value!.addLayer(layer);
                        }
                        if (removed)
                            for (const layer of removed) {
                                timelineManager.value!.removeLayer(layer);
                            }
                    },
                    { immediate: true, deep: false }
                );

                const projectItems = computed(() =>
                    projectTimeline ? Array.from(projectTimeline.items) : []
                );
                const projectItemsToTimelineItems = shallowReactive(
                    new WeakMap<TimelineItem, VideoTimelineElement>()
                );
                watchArray(
                    projectItems,
                    (_cur, _old, added, removed) => {
                        for (const item of added) {
                            const layerItem = new VideoTimelineElement();
                            syncRef(item.layer, layerItem.layer);

                            watch(item.layer, (layerIndex) => {
                                while (layers.length < layerIndex) {
                                    layers.push(new TimelineLayer());
                                }
                            });
                            timelineManager.value!.addLayerItem(layerItem);

                            projectItemsToTimelineItems.set(item, layerItem);
                        }

                        if (removed)
                            for (const item of removed) {
                                if (projectItemsToTimelineItems.has(item)) {
                                    timelineManager.value!.removeLayerItem(
                                        projectItemsToTimelineItems.get(item)!
                                    );
                                }
                            }
                    },
                    {
                        immediate: true
                    }
                );
                onCleanup(() => {
                    const curItems = Array.from(
                        timelineManager.value?.manager.allLayerItems.values() ?? []
                    );
                    for (const item of curItems) {
                        timelineManager.value?.removeLayerItem(item);
                    }
                });

                // Settings
                syncRef(invertScrollAxes, timelineManager.value!.manager.invertScrollAxes, {
                    direction: 'ltr',
                    immediate: false // dunno why
                });
            },
            { immediate: true }
        );
    }
});

onBeforeUnmount(() => {
    timelineManager.value?.destroy();
});
</script>

<style lang="scss" scoped>
.timeline {
    --surface-100: var(--p-splitter-gutter-background);
    --red-600: var(--p-red-600);
}
</style>
