import { App, setupDevtoolsPlugin } from '@vue/devtools-api';
import { shallowReactive, watch } from 'vue';
import { TimelineManager } from '..';

const INSPECTOR_ID = 'timeline-inspector';

const managers = shallowReactive(new Map<string, TimelineManager>());

export function setupDevtools(app: App) {
    const stateType = 'timeline properties';

    console.log('Setup');
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
            console.log(api);
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
                            children: [
                                {
                                    id: 'layer',
                                    label: `Layer ${payload.filter}`,
                                    tags: [
                                        {
                                            label: 'active',
                                            textColor: 0x000000,
                                            backgroundColor: 0xff984f
                                        },
                                        {
                                            label: 'test',
                                            textColor: 0xffffff,
                                            backgroundColor: 0x000000
                                        }
                                    ]
                                }
                            ]
                        });
                    }
                }
            });

            api.on.getInspectorState((payload) => {
                if (payload.inspectorId == INSPECTOR_ID) {
                    const nodeType = payload.nodeId.split('---')[0];
                    const managerId = payload.nodeId.split('---')[1];
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
                                        value: manager.viewport,
                                        objectType: 'reactive',
                                        editable: true
                                    }
                                ]
                            };
                            break;
                        }

                        default:
                            break;
                    }
                }
            });

            api.on.editInspectorState((payload) => {
                if (payload.inspectorId == INSPECTOR_ID) {
                    console.log(payload);

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

            watch(managers, () => {
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
