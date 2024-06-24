<template>
    <RouterView />
    <DynamicDialog />
    <NotificationManager />
</template>

<script setup lang="ts">
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';
import { useTitle } from '@vueuse/core';
import DynamicDialog from 'primevue/dynamicdialog';
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import NotificationManager from './components/General/Notifications/NotificationManager.vue';
import { router } from './main';

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

SettingsManager.setup();
</script>
