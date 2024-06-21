import { reactive } from 'vue';

export class SettingsManager {
    private static defaultNamespaces: SettingsNamespaceDefinition[] = [
        {
            name: 'general',
            title: 'General',
            childNamespaces: []
        },
        {
            name: 'editor1',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'editor2',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'editor3',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'editor4',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'editor5',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'editor6',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'editor7',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'editor8',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: [
                        {
                            title: 'Bool 1',
                            description: 'AAAAAAAAfasf',
                            name: 'A',
                            type: 'boolean'
                        },
                        {
                            title: 'Bool 2',
                            name: 'A',
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: []
                },
                {
                    name: 'media',
                    title: 'Media',
                    settings: []
                }
            ]
        },
        {
            name: 'keyboard',
            title: 'Keyboard',
            childNamespaces: [
                {
                    name: 'hotkeys',
                    title: 'Hotkeys'
                }
            ]
        }
    ];

    public static settingsDefinition = reactive(new Map<string, SettingsNamespace>());

    private static defaultsCreated = false;

    public static createDefaultNamespaces(namespace = this.defaultNamespaces, path: string[] = []) {
        if (this.defaultsCreated && path.length == 0) {
            this.defaultsCreated = true;
            return [];
        }

        const newNamespaces: SettingsNamespace[] = [];

        namespace.forEach((curNamespace) => {
            const curPath = [...path, curNamespace.name];

            const newNS = this.createNamespace(curPath, curNamespace);
            newNamespaces.push(newNS);

            if (curNamespace.childNamespaces) {
                const children = this.createDefaultNamespaces(
                    curNamespace.childNamespaces,
                    curPath
                );
                newNS.childNamespaces = children;
            }
        });
        return newNamespaces;
    }

    public static createNamespace(path: string[], namespace: SettingsNamespaceDefinition) {
        const newNamespace = new SettingsNamespace(path.join('.'), namespace);
        this.settingsDefinition.set(path.join('.'), newNamespace);

        return newNamespace;
    }
}

export class SettingsNamespace {
    public childNamespaces!: SettingsNamespace[];
    public title: string;
    public description?: string;
    public name: string;
    public settings: SettingsPropertyDefinition[];
    constructor(
        public path: string,
        private definition: SettingsNamespaceDefinition
    ) {
        this.title = definition.title;
        this.name = definition.name;
        this.description = definition.description;
        this.settings = definition.settings ?? [];
    }
}

export interface SettingsNamespaceDefinition {
    name: string;
    title: string;
    description?: string;
    settings?: SettingsPropertyDefinition[];
    childNamespaces?: SettingsNamespaceDefinition[];
}

export type SettingsPropertyDefinition =
    | SettingsGroup
    | SettingsArrayProperty
    | SettingsNumberProperty
    | SettingsStringProperty
    | SettingsDictionaryProperty
    | SettingsEnumProperty
    | SettingsBoolProperty;

interface DefaultSettingsProperty {
    type: string;
    name: string;
    title: string;
    description?: string;
}

export interface SettingsBoolProperty extends DefaultSettingsProperty {
    type: 'boolean';
    default?: boolean;
}

export interface SettingsStringProperty extends DefaultSettingsProperty {
    type: 'string';
    default?: string;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    autoTrim?: boolean;
    multiline?: boolean;
}

export interface SettingsNumberProperty extends DefaultSettingsProperty {
    type: 'number';
    default?: number;
    min?: number;
    max?: number;
    decimals?: number | false;
}

export interface SettingsArrayProperty extends DefaultSettingsProperty {
    type: 'array';
    default?: string[];
    minItems?: number;
    maxItems?: number;
}

export interface SettingsDictionaryProperty extends DefaultSettingsProperty {
    type: 'dictionary';
    default?: { [key: string]: string };
}

export interface SettingsEnumProperty extends DefaultSettingsProperty {
    type: 'enum';
    options: any[];
    valueKey?: string;
    labelKey?: string;
    default?: any;
}

export interface SettingsGroup {
    type: 'group';
    title: string;
    description?: string;
    settings: SettingsPropertyDefinition[];
}
