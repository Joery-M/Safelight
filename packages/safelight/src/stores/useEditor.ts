import type { PanelViewConfig } from '@/components/Panels/injection';
import { PhFilmStrip, PhFolders, PhFrameCorners } from '@phosphor-icons/vue';
import PanelManager from '@safelight/shared/UI/Panels/PanelManager';
import { defineStore } from 'pinia';
import { markRaw, reactive } from 'vue';

export const useEditor = defineStore('Editor', () => {
    const activePanels = reactive<PanelViewConfig>([
        {
            splitDirection: 'horizontal',
            split: [
                {
                    id: crypto.randomUUID(),
                    activePanelIndex: 0,
                    panels: [
                        { order: 0, panelId: 'SL-Library' },
                        { order: 1, panelId: 'SL-Timeline' },
                        { order: 2, panelId: 'SL-Library' }
                    ]
                },
                {
                    id: crypto.randomUUID(),
                    activePanelIndex: 0,
                    panels: [{ order: 0, panelId: 'SL-Monitor' }]
                }
            ]
        },
        {
            splitDirection: 'vertical',
            split: [
                {
                    id: crypto.randomUUID(),
                    activePanelIndex: 0,
                    panels: [
                        {
                            order: 0,
                            panelId: 'SL-Timeline'
                        }
                    ]
                }
            ]
        }
    ]);

    function AddDefaultPanels() {
        PanelManager.RegisterPanel('SL-Timeline', {
            component: () => import('../components/Editor/Timeline/Timeline.vue'),
            icon: markRaw(PhFilmStrip),
            name: 'Timeline'
        });

        PanelManager.RegisterPanel('SL-Library', {
            component: () => import('../components/Editor/Library/Library.vue'),
            icon: markRaw(PhFolders),
            name: 'Library'
        });

        PanelManager.RegisterPanel('SL-Monitor', {
            component: () => import('../components/Editor/Monitor/Monitor.vue'),
            icon: markRaw(PhFrameCorners),
            name: 'Monitor'
        });
    }

    return {
        activePanels,
        AddDefaultPanels
    };
});
