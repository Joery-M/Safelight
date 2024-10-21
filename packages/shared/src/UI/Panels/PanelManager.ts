import { shallowReactive } from 'vue';
import type { Panel } from '../../../../safelight/src/components/Panels/injection';

export default class PanelManager {
    static allPanels = shallowReactive(new Map<string, Panel>());

    public static RegisterPanel(id: string, panel: Panel) {
        this.allPanels.set(id, panel);
    }
}
