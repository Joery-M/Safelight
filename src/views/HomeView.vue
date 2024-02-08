<template>
    <SLButton type="primary" :size="btnSize">test</SLButton>
    <SLCard
        class="w-96 bg-neutral"
        :shadow-size="shadowSize"
        :title="shadowSize"
        :img-bottom="shadowSize == '10'"
        img="https://source.unsplash.com/random"
    >
        A
    </SLCard>
    <SLButton @click="router.push('/editor')">To Editor</SLButton>
</template>
<script setup lang="ts">
import router from '@/router';

const shadowSize = ref('xl');
const btnSize = ref('xs');
useIntervalFn(() => {
    if (shadowSize.value == 'xl') shadowSize.value = '10';
    else shadowSize.value = 'xl';

    if (btnSize.value == 'xs') btnSize.value = 'md';
    else btnSize.value = 'xs';
}, 1000);
</script>
