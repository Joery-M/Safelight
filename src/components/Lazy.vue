<script lang="ts" setup>
const shouldRender = ref(false);
nextTick(() => {
    shouldRender.value = true;
});
</script>
<template>
    <Suspense>
        <slot v-if="shouldRender" />
    </Suspense>
</template>
