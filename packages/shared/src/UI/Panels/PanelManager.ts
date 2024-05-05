import type { Panel } from '../../../../safelight/src/components/Panels/injection';
import { reactive } from 'vue';

export default class PanelManager {
    static allPanels: Map<string, Panel> = reactive(new Map<string, Panel>());

    public static RegisterPanel(id: string, panel: Panel) {
        this.allPanels.set(id, panel);
    }
}
