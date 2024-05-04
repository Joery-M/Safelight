import { PhFilmStrip, PhFolders, PhFrameCorners } from '@phosphor-icons/vue';
import type { Panel } from '@safelight/safelight/src/components/Panels/injection';
import { reactive } from 'vue';

export default class PanelManager {
    static allPanels: Map<string, Panel> = reactive(new Map<string, Panel>());

    public static RegisterPanel(id: string, panel: Panel) {
        this.allPanels.set(id, panel);
    }

    public static AddDefaultPanels() {
        this.RegisterPanel('SL-Timeline', {
            component: () =>
                import('@safelight/safelight/src/components/Editor/Timeline/Timeline.vue'),
            icon: PhFilmStrip,
            name: 'Timeline'
        });

        this.RegisterPanel('SL-Library', {
            component: () =>
                import('@safelight/safelight/src/components/Editor/Library/Library.vue'),
            icon: PhFolders,
            name: 'Library'
        });

        this.RegisterPanel('SL-Monitor', {
            component: () =>
                import('@safelight/safelight/src/components/Editor/Monitor/Monitor.vue'),
            icon: PhFrameCorners,
            name: 'Monitor'
        });
    }
}
