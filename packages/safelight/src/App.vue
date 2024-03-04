<template>
    <RouterView> </RouterView>
</template>

<script setup lang="ts">
const pageTitle = useTitle();

watchImmediate(useRouter().currentRoute, (newRoute) => {
    if (newRoute && newRoute.name)
        pageTitle.value = newRoute.name.toString().replace(/^\//, '') + ' | Safelight';
    else {
        pageTitle.value = 'Safelight';
    }
});
</script>
