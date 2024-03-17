<template>
    <RouterView> </RouterView>
</template>

<script setup lang="ts">
const pageTitle = useTitle();

watchImmediate(useRouter().currentRoute, (newRoute) => {
    if (newRoute && newRoute.name) {
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
