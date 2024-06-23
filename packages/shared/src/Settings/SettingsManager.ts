import { getByPath, setByPath } from 'dot-path-value';
import {
    computed,
    defineAsyncComponent,
    markRaw,
    reactive,
    type Component,
    type ComputedRef,
    type Raw
} from 'vue';

export class SettingsManager {
    private static defaultNamespaces: SettingsNamespaceDefinition[] = [
        {
            name: 'general',
            title: 'General',
            childNamespaces: []
        },
        {
            name: 'editor',
            title: 'Editor',
            childNamespaces: [
                {
                    name: 'playback',
                    title: 'Playback',
                    settings: []
                },
                {
                    name: 'timeline',
                    title: 'Timeline',
                    settings: [
                        {
                            type: 'boolean',
                            name: 'useTrackpad',
                            title: 'Trackpad mode',
                            description: 'Will inverse the axes on which the timeline will scroll.',
                            default: false
                        }
                    ]
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
                    title: 'Hotkeys',
                    settings: [
                        {
                            type: 'custom',
                            name: 'keybinds',
                            title: 'Hotkeys',
                            component: markRaw(
                                defineAsyncComponent(
                                    () => import('../../../safelight/src/views/dev/Packages.vue')
                                )
                            )
                        }
                    ]
                }
            ]
        }
    ];

    public static settingsDefinition = reactive(new Map<string, SettingsNamespace>());

    public static defaultSettings = reactive<{ [key: string]: any }>({});

    public static currentSettings = reactive<{ [key: string]: any }>({});

    private static defaultsCreated = false;

    public static setup() {
        this.createDefaultNamespaces(this.defaultNamespaces, []);
        this.createDefaultSettings(Array.from(this.settingsDefinition.values()));
    }

    public static createNamespace(path: string[], namespace: SettingsNamespaceDefinition) {
        const newNamespace = new SettingsNamespace(path, namespace);
        if (path.length <= 1) {
            this.settingsDefinition.set(path.join('.'), newNamespace);
        }

        return newNamespace;
    }

    public static getNamespace(path: string[]): SettingsNamespace | undefined;
    public static getNamespace(path: string): SettingsNamespace | undefined;
    public static getNamespace(path: string[] | string): SettingsNamespace | undefined {
        const pathArray = Array.isArray(path) ? path : path.split('.');

        // Loop through path array to find nested namespace
        return pathArray.reduce((ns, path, curIndex) => {
            if (!ns) return;

            const childNs = ns?.childNamespaces.find(
                (ns) => ns.path == pathArray.slice(0, curIndex + 1).join('.')
            );

            return childNs ?? ns;
        }, this.settingsDefinition.get(pathArray[0]));
    }

    public static getSetting(path: string): ComputedRef<any>;
    public static getSetting(path: string[]): ComputedRef<any>;
    public static getSetting(path: string | string[]) {
        const combinedPath = Array.isArray(path) ? path.join('.') : path;

        return computed(() => {
            const currentValue = getByPath(this.currentSettings, combinedPath);
            if (currentValue === undefined) {
                console.log(currentValue);
                return getByPath(this.defaultSettings, combinedPath);
            }
            return currentValue;
        });
    }

    public static setSetting(path: string, value: any): void;
    public static setSetting(path: string[], value: any): void;
    public static setSetting(path: string | string[], value: any) {
        const combinedPath = Array.isArray(path) ? path.join('.') : path;
        setByPath(this.currentSettings, combinedPath, value);
    }

    private static createDefaultNamespaces(
        namespace: SettingsNamespaceDefinition[],
        path: string[]
    ) {
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

    /**
     * Loop over each namespace and child namespaces to set the default settings
     */
    private static createDefaultSettings(namespace?: SettingsNamespace[]) {
        if (!namespace) return;

        namespace.forEach((ns) => {
            ns.setDefaultValues();
            this.createDefaultSettings(ns.childNamespaces);
        });
    }
}

export class SettingsNamespace {
    public path: string;
    public title: string;
    public description?: string;
    public name: string;
    public childNamespaces!: SettingsNamespace[];
    public settings: SettingsPropertyDefinition[];

    constructor(
        public pathArray: string[],
        definition: SettingsNamespaceDefinition
    ) {
        this.path = pathArray.join('.');
        this.title = definition.title;
        this.name = definition.name;
        this.description = definition.description;
        this.settings = definition.settings ?? [];
    }

    /**
     * Set the default values of each setting in the namespace.
     */
    public setDefaultValues() {
        this.settings.forEach((setting) => {
            if (setting.type !== 'group' && setting.default !== undefined) {
                setByPath(
                    SettingsManager.defaultSettings,
                    [...this.pathArray, setting.name].join('.'),
                    setting.default
                );
            }
        });
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
    | SettingsArrayProperty
    | SettingsBoolProperty
    | SettingsCustomProperty
    | SettingsDictionaryProperty
    | SettingsEnumProperty
    | SettingsGroup
    | SettingsNumberProperty
    | SettingsStringProperty;

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

export interface SettingsCustomProperty extends DefaultSettingsProperty {
    type: 'custom';
    component: Raw<Component>;
    default?: any;
}

export interface SettingsGroup {
    type: 'group';
    title: string;
    description?: string;
    settings: SettingsPropertyDefinition[];
}
