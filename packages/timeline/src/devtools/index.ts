import { App, setupDevtoolsPlugin } from '@vue/devtools-api';
import { watchDeep } from '@vueuse/core';
import { computed, shallowReactive } from 'vue';
import { TimelineManager } from '..';

const INSPECTOR_ID = 'timeline-inspector';

const managers = shallowReactive(new Map<string, TimelineManager>());

export function setupDevtools(app: App) {
    const stateType = 'timeline properties';

    setupDevtoolsPlugin(
        {
            id: 'app.safelight.timeline',
            app,
            label: '@safelight/timeline',
            packageName: '@safelight/timeline',
            homepage: 'https://safelight.app/',
            logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%23fbbf24'%3E%3Cpath d='M240-280h240v-80H240v80Zm120-160h240v-80H360v80Zm120-160h240v-80H480v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z'/%3E%3C/svg%3E`,
            componentStateTypes: [stateType]
        },
        (api) => {
            api.addInspector({
                id: INSPECTOR_ID,
                label: 'Timeline inspector',
                icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%23fbbf24'%3E%3Cpath d='M240-280h240v-80H240v80Zm120-160h240v-80H360v80Zm120-160h240v-80H480v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z'/%3E%3C/svg%3E`,
                treeFilterPlaceholder: 'Search for timeline ID...'
            });

            api.on.getInspectorTree((payload) => {
                if (payload.inspectorId === INSPECTOR_ID) {
                    payload.rootNodes = [];
                    for (const [id, manager] of managers) {
                        if (!id.includes(payload.filter)) {
                            continue;
                        }
                        payload.rootNodes.push({
                            id: 'timeline---' + id,
                            label: `Timeline (${id})`,
                            children: manager.layersSorted.value.map((layer) => {
                                return {
                                    id: 'layer---' + id + '---' + layer.index.value,
                                    label: `Layer ${layer.index.value}`
                                };
                            })
                            // [
                            //     {
                            //         id: 'layer',
                            //         label: `Layer ${payload.filter}`,
                            //         tags: [
                            //             {
                            //                 label: 'active',
                            //                 textColor: 0x000000,
                            //                 backgroundColor: 0xff984f
                            //             },
                            //             {
                            //                 label: 'test',
                            //                 textColor: 0xffffff,
                            //                 backgroundColor: 0x000000
                            //             }
                            //         ]
                            //     }
                            // ]
                        });
                    }
                }
            });

            api.on.getInspectorState((payload) => {
                if (payload.inspectorId == INSPECTOR_ID) {
                    const sections = payload.nodeId.split('---');
                    const nodeType = sections[0];
                    const managerId = sections[1];
                    const extraInfo = sections[2];
                    const manager = managers.get(managerId);
                    if (!manager) {
                        return;
                    }

                    switch (nodeType) {
                        case 'timeline': {
                            payload.state = {
                                viewport: [
                                    {
                                        key: 'view',
                                        value: computed(() => manager.viewport).value,
                                        objectType: 'reactive',
                                        editable: true
                                    },
                                    {
                                        key: 'view Y',
                                        value: manager.startY.value,
                                        objectType: 'ref',
                                        editable: false
                                    },
                                    {
                                        key: 'Pointer inside canvas',
                                        value: !manager.pointerOut.value,
                                        objectType: 'computed',
                                        editable: false
                                    },
                                    {
                                        key: 'Smoothing',
                                        value: manager.viewportSmoothing.value,
                                        objectType: 'ref',
                                        editable: false
                                    }
                                ],
                                items: [
                                    {
                                        key: 'Items end',
                                        value: manager.maxWidth.value,
                                        objectType: 'computed'
                                    }
                                ]
                            };
                            break;
                        }

                        case 'layer': {
                            const layer = manager.layersSorted.value.find(
                                (l) => l.index.value == parseInt(extraInfo)
                            );
                            if (layer) {
                                layer.highlight.value = true;
                            }
                            break;
                        }
                        default:
                            break;
                    }
                }
            });

            api.on.editInspectorState((payload) => {
                if (payload.inspectorId == INSPECTOR_ID) {
                    const nodeType = payload.nodeId.split('---')[0];
                    const managerId = payload.nodeId.split('---')[1];
                    const manager = managers.get(managerId);
                    if (!manager) {
                        return;
                    }

                    switch (nodeType) {
                        case 'timeline':
                            if (payload.path[0] == 'view')
                                if (payload.path[1] == 'start')
                                    manager.viewport.start = payload.state.value;
                                else if (payload.path[1] == 'end')
                                    manager.viewport.end = payload.state.value;
                            break;

                        default:
                            break;
                    }
                }
            });

            watchDeep(managers, () => {
                api.sendInspectorTree(INSPECTOR_ID);
            });
        }
    );
}

export function registerTimelineManager(manager: TimelineManager) {
    const id = crypto.randomUUID().split('-')[0];
    managers.set(id, manager);

    return () => {
        managers.delete(id);
    };
}
