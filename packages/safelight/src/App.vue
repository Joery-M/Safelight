<template>
    <RouterView />
    <NotificationManager />
</template>

<script setup lang="ts">
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
</script>
