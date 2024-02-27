<script lang="ts" setup>
const shouldRender = ref(false);
nextTick(() => {
    shouldRender.value = true;
});
</script>
<template>
    <div>
        <slot v-if="shouldRender" />
    </div>
</template>
