import { App, setupDevtoolsPlugin } from '@vue/devtools-api';
import { shallowReactive, toRaw, watch } from 'vue';
import { TimelineManager } from '..';
import { TimelineLayer } from '../elements/TimelineLayer';

const INSPECTOR_ID = 'timeline-inspector';

const managers = shallowReactive(new Map<string, TimelineManager>());

export let registerTimelineManager: (manager: TimelineManager) => () => void = (
    manager: TimelineManager
) => {
    const id = crypto.randomUUID().split('-')[0];

    manager.events.on('unmount', () => {
        managers.delete(id);
    });

    managers.set(id, manager);
    return () => {
        managers.delete(id);
    };
};

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
                            id: 'timeline::' + id,
                            label: `Timeline (${id})`,
                            children: manager.layersSorted.value.map((layer) => {
                                return {
                                    id: 'layer::' + id + '::' + layer.index.value,
                                    label: `Layer ${layer.index.value + 1}`,
                                    children: Array.from(layer.elements.values()).map(
                                        (_element, i) => {
                                            return {
                                                id:
                                                    'element::' +
                                                    id +
                                                    '::' +
                                                    layer.index.value +
                                                    ';' +
                                                    i,
                                                label: 'Element ' + i
                                            };
                                        }
                                    )
                                };
                            })
                        });
                    }
                }
            });

            api.on.getInspectorState((payload) => {
                if (payload.inspectorId == INSPECTOR_ID) {
                    const sections = payload.nodeId.split('::');
                    const nodeType = sections[0];
                    const managerId = sections[1];
                    const extraInfo = sections[2];
                    const manager = managers.get(managerId);
                    if (!manager) {
                        return;
                    }
                    let ignoreLayerChange: TimelineLayer | undefined;

                    switch (nodeType) {
                        case 'timeline': {
                            payload.state = {
                                viewport: [
                                    {
                                        key: 'view',
                                        value: toRaw(manager.viewport),
                                        objectType: 'reactive',
                                        editable: true
                                    },
                                    {
                                        key: 'Pointer inside canvas',
                                        value: !manager._pointerOut.value,
                                        objectType: 'computed',
                                        editable: false
                                    },
                                    {
                                        key: 'Smoothing',
                                        value: {
                                            x: manager.viewportSmoothingX.value,
                                            y: manager.viewportSmoothingY.value
                                        },
                                        objectType: 'computed',
                                        editable: false
                                    }
                                ],
                                items: [
                                    {
                                        key: 'Items end',
                                        value: manager._maxWidth.value,
                                        objectType: 'computed'
                                    }
                                ]
                            };
                            break;
                        }

                        case 'element': {
                            const layer = manager.layersSorted.value.find(
                                (l) => l.index.value == parseInt(extraInfo.split(';')[0])
                            );
                            if (!layer) break;
                            const element = Array.from(layer.elements.values())[
                                parseInt(extraInfo.split(';')[1])
                            ];
                            if (!element) break;
                            payload.state = {
                                item: [
                                    {
                                        key: 'start',
                                        value: element.start.value,
                                        editable: false
                                    },
                                    {
                                        key: 'end',
                                        value: element.end.value,
                                        editable: false
                                    }
                                ],
                                rendering: [
                                    {
                                        key: 'Render time (ms)',
                                        value: element.__RENDER_TIME__.value
                                    },
                                    {
                                        key: 'Render time (% of layer)',
                                        value:
                                            Math.round(
                                                (element.__RENDER_TIME__.value /
                                                    layer.__RENDER_TIME__.value) *
                                                    100
                                            ) + '%'
                                    },
                                    {
                                        key: 'Render time (% of timeline)',
                                        value:
                                            Math.round(
                                                (element.__RENDER_TIME__.value /
                                                    manager.__RENDER_TIME__.value) *
                                                    100
                                            ) + '%'
                                    }
                                ]
                            };
                            break;
                        }

                        case 'layer': {
                            const layer = manager.layersSorted.value.find(
                                (l) => l.index.value == parseInt(extraInfo.split(';')[0])
                            );
                            ignoreLayerChange = layer;
                            if (layer) {
                                if (!layer._highlight.value) {
                                    layer._highlight.value = true;
                                }
                                payload.state = {
                                    rendering: [
                                        {
                                            key: 'Render time (ms)',
                                            value: layer.__RENDER_TIME__.value
                                        },
                                        {
                                            key: 'Render time (% of parent)',
                                            value:
                                                Math.round(
                                                    (layer.__RENDER_TIME__.value /
                                                        manager.__RENDER_TIME__.value) *
                                                        100
                                                ) + '%'
                                        }
                                    ]
                                };
                            }
                            break;
                        }
                        default:
                            break;
                    }

                    manager.layers.forEach((layer) => {
                        if (ignoreLayerChange !== layer && layer._highlight.value) {
                            layer._highlight.value = false;
                        }
                    });
                }
            });

            api.on.editInspectorState((payload) => {
                if (payload.inspectorId == INSPECTOR_ID) {
                    const nodeType = payload.nodeId.split('::')[0];
                    const managerId = payload.nodeId.split('::')[1];
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
                                else if (payload.path[1] == 'yPos')
                                    manager.viewport.yPos = payload.state.value;
                            break;

                        default:
                            break;
                    }
                }
            });

            managers.forEach((manager, id) => {
                watch(
                    [
                        manager.viewportSmooth.end,
                        manager.viewportSmooth.start,
                        manager.viewportSmoothingX,
                        manager._maxWidth,
                        manager.__RENDER_TIME__,
                        manager.layers
                    ],
                    () => {
                        api.sendInspectorTree(INSPECTOR_ID);
                    }
                );
                manager.events.on('unmount', () => {
                    managers.delete(id);

                    api.sendInspectorTree(INSPECTOR_ID);
                });
                api.sendInspectorTree(INSPECTOR_ID);
            });

            registerTimelineManager = (manager: TimelineManager) => {
                const id = crypto.randomUUID().split('-')[0];

                manager.events.on('unmount', () => {
                    managers.delete(id);
                    api.sendInspectorTree(INSPECTOR_ID);
                });

                managers.set(id, manager);

                watch(
                    [
                        manager.viewportSmooth.end,
                        manager.viewportSmooth.start,
                        manager.viewportSmoothingX,
                        manager._maxWidth,
                        manager.__RENDER_TIME__,
                        manager.layers
                    ],
                    () => {
                        api.sendInspectorTree(INSPECTOR_ID);
                    }
                );
                api.sendInspectorTree(INSPECTOR_ID);
                return () => {
                    managers.delete(id);
                };
            };
            // setInterval(() => {
            //     api.sendInspectorTree(INSPECTOR_ID);
            // }, 1000);

            // watchDeep(
            //     managers,
            //     () => {
            //         api.sendInspectorTree(INSPECTOR_ID);
            //     },
            //     {}
            // );
        }
    );
}
