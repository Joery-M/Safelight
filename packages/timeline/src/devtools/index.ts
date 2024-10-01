import { App, setupDevtoolsPlugin } from '@vue/devtools-api';
import { watchArray } from '@vueuse/core';
import { computed, shallowReactive, watchEffect } from 'vue';
import { __DEVTOOLS_AVAILABLE__, TimelineManager } from '..';
import { TimelineLayer } from '../elements/TimelineLayer';

const INSPECTOR_ID = 'timeline-inspector';

export let registerTimelineManager!: (manager: TimelineManager) => () => void;

export function setupDevtools(app: App) {
    const stateType = 'timeline properties';

    const managers = shallowReactive(new Map<string, TimelineManager>());

    setupDevtoolsPlugin(
        {
            id: 'app.safelight.timeline',
            app,
            label: '@safelight/timeline',
            packageName: '@safelight/timeline',
            homepage: 'https://safelight.app/',
            logo: import.meta.resolve('../../assets/devtools.svg'),
            componentStateTypes: [stateType]
        },
        (api) => {
            api.addInspector({
                id: INSPECTOR_ID,
                label: 'Timeline inspector',
                icon: import.meta.resolve('../../assets/devtools.svg'),
                treeFilterPlaceholder: 'Search for timeline ID...'
            });

            api.on.getInspectorTree((payload) => {
                if (payload.inspectorId === INSPECTOR_ID) {
                    payload.rootNodes = [];
                    for (const [id, manager] of managers) {
                        if (!id.includes(payload.filter)) {
                            continue;
                        }
                        payload.rootNodes.push(manager._devtools_get_tree(id));
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
                            payload.state = manager._devtools_get_state();
                            break;
                        }

                        case 'element': {
                            const layer = manager.layersSorted.value.find(
                                (l) => l.index.value == parseInt(extraInfo.split(';')[0])
                            );
                            if (!layer) break;
                            const element = Array.from(layer.elements.value)[
                                parseInt(extraInfo.split(';')[1])
                            ];
                            if (!element) break;
                            const isHidden = isNaN(layer.__ELEMENT_RENDER_TIME__.get(element) ?? 0);
                            payload.state = {
                                rendering: !isHidden
                                    ? [
                                          {
                                              key: 'Render time (ms)',
                                              value:
                                                  layer.__ELEMENT_RENDER_TIME__.get(element) ?? NaN
                                          },
                                          {
                                              key: 'Render time (% of layer)',
                                              value:
                                                  Math.round(
                                                      ((layer.__ELEMENT_RENDER_TIME__.get(
                                                          element
                                                      ) ?? 0) /
                                                          layer.__RENDER_TIME__.value) *
                                                          100
                                                  ) + '%'
                                          },
                                          {
                                              key: 'Render time (% of timeline)',
                                              value:
                                                  Math.round(
                                                      ((layer.__ELEMENT_RENDER_TIME__.get(
                                                          element
                                                      ) ?? 0) /
                                                          manager.__RENDER_TIME__.value) *
                                                          100
                                                  ) + '%'
                                          }
                                      ]
                                    : [],
                                ...(element.devtoolsState ? element.devtoolsState() : {})
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
                                payload.state = layer._devtools_get_state();
                            }
                            break;
                        }

                        case 'item': {
                            const elem = Array.from(manager.timelineElements).at(
                                parseInt(extraInfo)
                            );
                            if (!elem) return;
                            const isHidden = isNaN(manager.__ELEMENT_RENDER_TIME.get(elem) ?? 0);
                            payload.state = {
                                rendering: !isHidden
                                    ? [
                                          {
                                              key: 'Render time (ms)',
                                              value: manager.__ELEMENT_RENDER_TIME.get(elem) ?? NaN
                                          },
                                          {
                                              key: 'Render time (% of timeline)',
                                              value:
                                                  Math.round(
                                                      ((manager.__ELEMENT_RENDER_TIME.get(elem) ??
                                                          0) /
                                                          manager.__RENDER_TIME__.value) *
                                                          100
                                                  ) + '%'
                                          }
                                      ]
                                    : [],
                                ...(elem.devtoolsState ? elem.devtoolsState() : {})
                            };
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

            registerTimelineManager = (manager: TimelineManager) => {
                const id = crypto.randomUUID().split('-')[0];

                managers.set(id, manager);

                // Throttled update state
                let updateStateFnTimeout: ReturnType<typeof setTimeout>;
                let lastUpdateState = 0;
                const updateStateFn = () => {
                    const update = () => {
                        api.sendInspectorState(INSPECTOR_ID);
                        lastUpdateState = performance.now();
                    };

                    if (lastUpdateState < performance.now() - 16) {
                        update();
                    }
                    clearTimeout(updateStateFnTimeout);

                    updateStateFnTimeout = setTimeout(update, 16);
                };
                // Throttled update tree
                let updateTreeFnTimeout: ReturnType<typeof setTimeout>;
                let lastUpdateTree = 0;
                const updateTreeFn = () => {
                    const update = () => {
                        api.sendInspectorTree(INSPECTOR_ID);
                        lastUpdateTree = performance.now();
                    };

                    if (lastUpdateTree < performance.now() - 16) {
                        update();
                    }
                    clearTimeout(updateTreeFnTimeout);

                    updateTreeFnTimeout = setTimeout(update, 16);
                };

                watchEffect(manager._devtools_get_state, {
                    onTrigger() {
                        updateStateFn();
                    }
                });

                watchArray(
                    manager.layersSorted,
                    (_cur, _old, added) => {
                        for (const layer of added) {
                            watchEffect(layer._devtools_get_state, {
                                flush: 'post',
                                onTrigger() {
                                    updateStateFn();
                                }
                            });
                        }
                    },
                    {
                        immediate: true,
                        deep: false
                    }
                );
                watchArray(
                    computed(() => Array.from(manager.timelineElements)),
                    (_cur, _old, added) => {
                        for (const element of added) {
                            if (element.devtoolsState) {
                                watchEffect(element.devtoolsState, {
                                    onTrigger() {
                                        updateStateFn();
                                    }
                                });
                            }
                        }
                    },
                    {
                        immediate: true,
                        deep: false
                    }
                );

                const elems = computed(() => Array.from(manager.allLayerItems));
                watchArray(
                    elems,
                    (_cur, _old, added) => {
                        for (const item of added) {
                            if (item.devtoolsState) {
                                watchEffect(item.devtoolsState, {
                                    flush: 'post',
                                    onTrigger() {
                                        updateStateFn();
                                    }
                                });
                            }
                        }
                    },
                    { immediate: true, deep: false }
                );

                watchEffect(manager._devtools_get_tree.bind(undefined, id), {
                    flush: 'post',
                    onTrigger() {
                        updateTreeFn();
                    }
                });

                api.sendInspectorTree(INSPECTOR_ID);
                return () => {
                    managers.delete(id);
                    api.sendInspectorState(INSPECTOR_ID);
                    api.sendInspectorTree(INSPECTOR_ID);
                };
            };

            __DEVTOOLS_AVAILABLE__.value = true;
        }
    );
}
