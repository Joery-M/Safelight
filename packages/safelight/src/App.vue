<template>
    <RouterView />
    <NotificationManager />
</template>

<script setup lang="ts">
import { NotificationService } from '@safelight/shared/UI/Notifications/NotificationService';
import { router } from './main';

const pageTitle = useTitle();
// useIntervalFn(() => {
//     NotificationService.notify({
//         severity: Math.random() > 0.5 ? 'error' : 'info',
//         text: 'asdf',
//         title: Math.floor(Math.random() * 100).toString(),
//         autoHide: true
//     });
// }, 2500);
NotificationService.notify({
    severity: Math.random() > 0.5 ? 'error' : 'info',
    text: 'asdf',
    title: Math.floor(Math.random() * 100).toString()
});
NotificationService.notify({
    severity: Math.random() > 0.5 ? 'error' : 'info',
    text: 'asdf',
    title: Math.floor(Math.random() * 100).toString()
});
NotificationService.notify({
    severity: Math.random() > 0.5 ? 'error' : 'info',
    text: 'asdf',
    title: Math.floor(Math.random() * 100).toString()
});
NotificationService.notify({
    severity: Math.random() > 0.5 ? 'error' : 'info',
    text: 'asdf',
    title: Math.floor(Math.random() * 100).toString()
});
NotificationService.notify({
    severity: Math.random() > 0.5 ? 'error' : 'info',
    text: 'asdf',
    title: Math.floor(Math.random() * 100).toString()
});

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
</script>
