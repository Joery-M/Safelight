import type { Component, MaybeRefOrGetter } from 'vue';

export interface Panel {
    name: MaybeRefOrGetter<string>;
    icon: MaybeRefOrGetter<string>;
    component: () => Promise<Component | { default: Component }>;
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
