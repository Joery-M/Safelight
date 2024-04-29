import type { Panel } from '@/stores/useEditor';
import type { InjectionKey } from 'vue';

export const DRAGGING_PANEL = Symbol() as InjectionKey<DraggingPanelInject>;

export interface DraggingPanelInject {
    panel: globalThis.Ref<Panel | undefined>;
    setPanel: (panel: Panel | undefined) => void;
}
