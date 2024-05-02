import { PhFilmStrip, PhFolders, PhFrameCorners } from '@phosphor-icons/vue';
import type { Panel } from './useEditor';

export default class PanelManager {
    static allPanels: Map<string, Panel> = reactive(new Map());

    public static RegisterPanel(id: string, panel: Panel) {
        this.allPanels.set(id, panel);
    }

    public static AddDefaultPanels() {
        this.RegisterPanel('SL-Timeline', {
            component: defineAsyncComponent(
                () => import('../components/Editor/Timeline/Timeline.vue')
            ),
            icon: PhFilmStrip,
            name: 'Timeline'
        });

        this.RegisterPanel('SL-Library', {
            component: defineAsyncComponent(
                () => import('../components/Editor/Library/Library.vue')
            ),
            icon: PhFolders,
            name: 'Library'
        });

        this.RegisterPanel('SL-Monitor', {
            component: defineAsyncComponent(
                () => import('../components/Editor/Monitor/Monitor.vue')
            ),
            icon: PhFrameCorners,
            name: 'Monitor'
        });
    }
}
