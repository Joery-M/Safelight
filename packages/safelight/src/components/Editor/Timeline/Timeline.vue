<template>
    <div class="relative size-full">
        <canvas ref="canvas" class="size-full"></canvas>
        <div class="bg-surface-900 absolute right-0 top-0 p-4">
            <Button @click="addTimelineItem()"> Add item </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';
import type { TimelineItem } from '@safelight/shared/Timeline/TimelineItem';
import { createTimelineManager, type CreateTimelineFn } from '@safelight/timeline';
import { TimelineCursorElement } from '@safelight/timeline/elements/TimelineCursorElement';
import { TimelineGrid } from '@safelight/timeline/elements/TimelineGrid';
import { TimelineLayer } from '@safelight/timeline/elements/TimelineLayer';
import { VideoTimelineElement } from '@safelight/timeline/elements/VideoTimelineElement';
import { syncRef, watchArray } from '@vueuse/core';
import Button from 'primevue/button';
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    shallowReactive,
    shallowRef,
    watch,
    watchEffect
} from 'vue';

const project = useProject();
const projectTimeline = computed(() => project.timeline);

const canvas = ref<HTMLCanvasElement>();

const invertScrollAxes = SettingsManager.getSetting<boolean>('editor.timeline.useTrackpad');
// const zoomFactor = SettingsManager.getSetting<number>('editor.timeline.zoomFactor');
// const alignment = SettingsManager.getSetting<'top' | 'bottom'>('editor.timeline.align');

const timelineManager = shallowRef<CreateTimelineFn>();
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

                syncRef(projectTimeline.pbPos, pbCursor.cursorPos, {
                    transform: {
                        ltr: (val) => val * projectTimeline.frameDuration.value,
                        rtl: (val) => Math.round(val / projectTimeline.frameDuration.value)
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
                    projectTimeline?.items ? Array.from(projectTimeline.items.values()) : []
                );
                const projectItemsToTimelineItems = shallowReactive(
                    new WeakMap<TimelineItem, VideoTimelineElement>()
                );
                watchArray(
                    projectItems,
                    (_cur, _old, added, removed) => {
                        for (const item of added) {
                            const layerItem = new VideoTimelineElement();
                            layerItem.layer.value = item.layer.value;
                            layerItem.start.value = item.start.value;
                            layerItem.end.value = item.end.value;

                            syncRef(item.layer, layerItem.layer);
                            syncRef(item.start, layerItem.start);
                            syncRef(item.end, layerItem.end);

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
                watchEffect(() => {
                    timelineManager.value!.manager.invertScrollAxes.value =
                        invertScrollAxes?.value ?? false;
                });
            },
            { immediate: true }
        );
    }
});

// TODO: This is temporary
async function addTimelineItem() {
    await project.timeline?.createTimelineItem();
}
</script>
