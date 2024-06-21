<template>
    <RouterView />
    <DynamicDialog />
    <NotificationManager />
</template>

<script setup lang="ts">
import DynamicDialog from 'primevue/dynamicdialog';
import { router } from './main';
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';

const pageTitle = useTitle();
watchEffect(() => {
    const newRoute = router.currentRoute.value;
    if (newRoute.name) {
        const newName = newRoute.name.toString().replace(/^\//, '').split('/').at(-1);
        if (newName) {
            pageTitle.value = newName + ' | Safelight';
        } else {
            pageTitle.value = 'Safelight';
        }
    } else {
        pageTitle.value = 'Safelight';
    }
});

SettingsManager.createDefaultNamespaces();
</script>
