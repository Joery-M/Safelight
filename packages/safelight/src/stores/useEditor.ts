import { defineStore } from 'pinia';
import type { Component, DefineComponent } from 'vue';

export const useEditor = defineStore('Editor', () => {
    const activePanels = reactive<ActivePanels>({
        timeline: {
            activeIndex: 0,
            panels: ['SL-Timeline']
        },
        properties: {
            activeIndex: 0,
            panels: ['SL-Library', 'SL-Timeline', 'SL-Library']
        },
        monitor: {
            activeIndex: 0,
            panels: ['SL-Monitor']
        }
    });

    return {
        activePanels
    };
});

export interface Panel {
    name: string;
    icon: Component;
    component: DefineComponent<any, any, any>;
}

export interface ActivePanels {
    [group: string]: {
        /**
         * List of panel IDs
         */
        panels: string[];
        /**
         * Active index
         */
        activeIndex: number;
    };
}
