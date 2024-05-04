import type { Component, InjectionKey } from 'vue';

export const DRAGGING_PANEL = Symbol() as InjectionKey<DraggingPanelInject>;

export interface DraggingPanelInject {
    panel: globalThis.Ref<Panel | undefined>;
    setPanel: (panel: Panel | undefined) => void;
}

export interface Panel {
    name: string;
    icon: Component;
    component: () => Promise<Component>;
}

export type SplitDirection = 'vertical' | 'horizontal';

export type PanelViewConfig = PanelSplitConfig[];

export interface PanelSplitConfig {
    splitDirection: SplitDirection;
    split?: (PanelSplitConfig | PanelGroupConfig)[];
}
export interface PanelGroupConfig {
    id: string;
    panels: PanelConfig[];
    /**
     * Active panel in this group
     */
    activePanelIndex: number;
}

export interface PanelConfig {
    /**
     * Panel ID from `PanelManager`
     */
    panelId: string;
    order: number;
    data?: any;
}
