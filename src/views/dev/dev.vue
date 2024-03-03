<template>
    <RouterLink to="/">
        <Button>
            <PhHouse />
        </Button>
    </RouterLink>
    <SLCard title="Dev pages">
        <template
            v-for="route in $router.getRoutes().filter((a) => a.path.startsWith('/dev/'))"
            :key="route.path"
        >
            <RouterLink :to="route.path">
                <Button>{{ sentenceCase(route.path.replace('/dev/', '')) }}</Button>
            </RouterLink>
        </template>
    </SLCard>
</template>

<script setup lang="ts">
import { sentenceCase } from 'change-case';
import { RouterLink } from 'vue-router';
</script>

<route lang="json">
{ "path": "/dev" }
</route>
