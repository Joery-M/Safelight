<template>
    <SLButton to="/">
        <template #icon>
            <PhHouse />
        </template>
    </SLButton>
    <SLCard title="Dev pages">
        <template
            v-for="route in $router.getRoutes().filter((a) => a.path.startsWith('/dev/'))"
            :key="route.path"
        >
            <SLButton :to="route.path">{{
                sentenceCase(route.path.replace('/dev/', ''))
            }}</SLButton>
        </template>
    </SLCard>
</template>

<script setup lang="ts">
import { PhHouse } from '@phosphor-icons/vue';
import { sentenceCase } from 'change-case';
</script>

<route lang="json">
{ "path": "/dev" }
</route>
