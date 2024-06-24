<script lang="ts" setup>
import { nextTick, ref } from 'vue';

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
