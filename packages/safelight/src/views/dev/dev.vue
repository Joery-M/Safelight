<template>
    <Card title="Dev pages">
        <template #subtitle>
            <RouterLink to="/">
                <Button>
                    <template #icon>
                        <PhHouse />
                    </template>
                </Button>
            </RouterLink>
        </template>
        <template #content>
            <template
                v-for="route in $router.getRoutes().filter((a) => a.path.startsWith('/dev/'))"
                :key="route.path"
            >
                <RouterLink :to="route.path" class="mb-2 block">
                    <Button>
                        {{ (route.name?.toString() ?? route.path).replace('/dev/', '') }}
                    </Button>
                </RouterLink>
            </template>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import { RouterLink } from 'vue-router';
</script>

<route lang="json">
{ "path": "/dev" }
</route>
