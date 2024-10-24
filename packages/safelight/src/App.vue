<template>
    <RouterView />
    <DynamicDialog />
    <NotificationManager />
</template>

<script setup lang="ts">
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';
import { useTitle } from '@vueuse/core';
import DynamicDialog from 'primevue/dynamicdialog';
import { defineAsyncComponent, markRaw, watchEffect } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import NotificationManager from './components/General/Notifications/NotificationManager.vue';

const pageTitle = useTitle();
const newRoute = useRoute();
watchEffect(() => {
    if (newRoute.name) {
        const newName = newRoute.meta.overridePageName
            ? undefined
            : newRoute.name.toString().replace(/^\//, '').split('/').at(-1);
        if (newName) {
            pageTitle.value = newName + ' | Safelight';
        } else {
            pageTitle.value = 'Safelight';
        }
    } else {
        pageTitle.value = 'Safelight';
    }
});

SettingsManager.setup([
    {
        name: 'general',
        title: 'General',
        childNamespaces: []
    },
    {
        name: 'editor',
        title: 'Editor',
        icon: markRaw(
            defineAsyncComponent(async () => (await import('@phosphor-icons/vue')).PhSidebar)
        ),
        childNamespaces: [
            {
                name: 'playback',
                title: 'Playback',
                icon: markRaw(
                    defineAsyncComponent(
                        async () => (await import('@phosphor-icons/vue')).PhPlayPause
                    )
                ),
                settings: []
            },
            {
                name: 'timeline',
                title: 'Timeline',
                icon: markRaw(
                    defineAsyncComponent(
                        async () => (await import('@phosphor-icons/vue')).PhFilmStrip
                    )
                ),
                settings: [
                    {
                        type: 'boolean',
                        name: 'useTrackpad',
                        title: 'Trackpad mode',
                        description: 'Will inverse the axes on which the timeline will scroll.',
                        default: false
                    },
                    {
                        type: 'number',
                        name: 'zoomFactor',
                        title: 'Zoom factor',
                        description: 'The amount to zoom in and out by when scrolling.',
                        default: 2,
                        decimals: false,
                        range: true,
                        min: 1,
                        max: 100
                    },
                    {
                        type: 'enum',
                        name: 'align',
                        title: 'Align timeline',
                        default: 'bottom',
                        options: [
                            { value: 'top', label: 'Top' },
                            { value: 'bottom', label: 'Bottom' }
                        ],
                        labelKey: 'label',
                        valueKey: 'value'
                    }
                ]
            },
            {
                name: 'library',
                title: 'Library',
                icon: markRaw(
                    defineAsyncComponent(
                        async () => (await import('@phosphor-icons/vue')).PhFolders
                    )
                ),
                settings: [
                    {
                        type: 'group',
                        title: 'Media',
                        settings: [
                            {
                                type: 'string',
                                title: 'Test',
                                description: 'Test',
                                name: 'test',
                                pattern: /icle+/,
                                maxLength: 10,
                                default: 'icle'
                            }
                        ]
                    },
                    {
                        type: 'group',
                        title: 'Files',
                        settings: []
                    }
                ]
            }
        ]
    },
    {
        name: 'keyboard',
        title: 'Keyboard',
        icon: markRaw(
            defineAsyncComponent(async () => (await import('@phosphor-icons/vue')).PhKeyboard)
        ),
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
                            defineAsyncComponent(() => import('@/views/dev/Packages.vue'))
                        )
                    }
                ]
            }
        ]
    }
]);
</script>
