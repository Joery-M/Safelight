import type { Panel, PanelViewConfig } from '@/components/Panels/injection';
import type { TimelineItem } from '@safelight/shared/Timeline/TimelineItem';
import { defineStore } from 'pinia';
import { reactive, shallowReactive, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

export const useEditor = defineStore('Editor', () => {
    //
    // Panels
    //

    const allPanels = shallowReactive(new Map<string, Panel>());
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
                    activePanelIndex: 1,
                    panels: [
                        { order: 0, panelId: 'SL-Monitor' },
                        { order: 1, panelId: 'SL-ItemProperties' }
                    ]
                }
            ]
        },
        {
            splitDirection: 'vertical',
            split: [
                {
                    id: crypto.randomUUID(),
                    activePanelIndex: 0,
                    panels: [{ order: 0, panelId: 'SL-Timeline' }]
                }
            ]
        }
    ]);

    function registerPanel(id: string, panel: Panel) {
        allPanels.set(id, panel);
    }

    const i18n = useI18n();

    registerPanel('SL-Timeline', {
        component: () => import('../components/Editor/Timeline/Timeline.vue'),
        icon: 'ph ph-film-strip',
        name: () => i18n.t('panels.timeline.title')
    });

    registerPanel('SL-Library', {
        component: () => import('../components/Editor/Library/Library.vue'),
        icon: 'ph ph-folders',
        name: () => i18n.t('panels.library.title')
    });

    registerPanel('SL-ItemProperties', {
        component: () => import('../components/Editor/Properties/ItemProperties.vue'),
        icon: 'ph ph-faders-horizontal',
        name: () => i18n.t('panels.item-properties.title')
    });

    registerPanel('SL-Monitor', {
        component: () => import('../components/Editor/Monitor/Monitor.vue'),
        icon: 'ph ph-frame-corners',
        name: () => i18n.t('panels.monitor.title')
    });

    //
    // Selected item
    //

    const selectedTimelineItem = shallowRef<TimelineItem>();

    return {
        activePanels,
        allPanels,
        registerPanel,
        selectedTimelineItem
    };
});
