<template>
    <RouterView> </RouterView>
</template>

<script setup lang="ts">
const pageTitle = useTitle();

watchImmediate(useRouter().currentRoute, (newRoute) => {
    if (newRoute && newRoute.name)
        pageTitle.value = newRoute.name.replace(/^\//, '') + ' | Safelight';
    else {
        pageTitle.value = 'Safelight';
    }
});
</script>
