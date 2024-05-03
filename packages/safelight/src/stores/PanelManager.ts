import type { Panel } from '@/components/Panels/injection';
import { PhFilmStrip, PhFolders, PhFrameCorners } from '@phosphor-icons/vue';

export default class PanelManager {
    static allPanels: Map<string, Panel> = reactive(new Map<string, Panel>());

    public static RegisterPanel(id: string, panel: Panel) {
        this.allPanels.set(id, panel);
    }

    public static AddDefaultPanels() {
        this.RegisterPanel('SL-Timeline', {
            component: () => import('../components/Editor/Timeline/Timeline.vue'),
            icon: PhFilmStrip,
            name: 'Timeline'
        });

        this.RegisterPanel('SL-Library', {
            component: () => import('../components/Editor/Library/Library.vue'),
            icon: PhFolders,
            name: 'Library'
        });

        this.RegisterPanel('SL-Monitor', {
            component: () => import('../components/Editor/Monitor/Monitor.vue'),
            icon: PhFrameCorners,
            name: 'Monitor'
        });
    }
}
