import Library from '@/components/Editor/Library/Library.vue';
import Monitor from '@/components/Editor/Monitor/Monitor.vue';
import Timeline from '@/components/Editor/Timeline/Timeline.vue';
import { PhFilmStrip, PhFolders, PhFrameCorners } from '@phosphor-icons/vue';
import { defineStore } from 'pinia';
import type { Component } from 'vue';

export const useEditor = defineStore('Editor', () => {
    const activePanels = reactive<ActivePanels>({
        timeline: {
            activeIndex: 0,
            panels: [
                {
                    component: Timeline,
                    icon: PhFilmStrip,
                    name: 'Timeline'
                }
            ]
        },
        properties: {
            activeIndex: 0,
            panels: [
                {
                    component: Library,
                    icon: PhFolders,
                    name: 'Library'
                },
                {
                    component: Timeline,
                    icon: PhFilmStrip,
                    name: 'Timeline'
                },
                {
                    component: Library,
                    icon: PhFolders,
                    name: 'Library'
                }
            ]
        },
        monitor: {
            activeIndex: 0,
            panels: [
                {
                    component: Monitor,
                    icon: PhFrameCorners,
                    name: 'Monitor'
                }
            ]
        }
    });

    return {
        activePanels
    };
});

export interface Panel {
    name: string;
    icon: Component;
    component: Component;
}

export interface ActivePanels {
    [group: string]: {
        panels: Panel[];
        activeIndex: number;
    };
}
