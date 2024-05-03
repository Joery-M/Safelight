import type { PanelViewConfig } from '@/components/Panels/injection';
import { defineStore } from 'pinia';

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
    // const activePanels = reactive<PanelViewConfig>([
    //     {
    //         id: crypto.randomUUID(),
    //         orderX: 0,
    //         orderY: 0,
    //         activePanelIndex: 0,
    //         panels: [
    //             { order: 0, panelId: 'SL-Library' },
    //             { order: 1, panelId: 'SL-Timeline' },
    //             { order: 2, panelId: 'SL-Library' }
    //         ]
    //     },
    //     {
    //         id: crypto.randomUUID(),
    //         orderX: 1,
    //         orderY: 0,
    //         activePanelIndex: 0,
    //         panels: [{ order: 0, panelId: 'SL-Monitor' }]
    //     },
    //     {
    //         id: crypto.randomUUID(),
    //         orderX: 0,
    //         orderY: 1,
    //         activePanelIndex: 0,
    //         panels: [
    //             {
    //                 order: 0,
    //                 panelId: 'SL-Timeline'
    //             }
    //         ]
    //     }
    // ]);

    return {
        activePanels
    };
});
