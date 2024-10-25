<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/">
                <Button icon="ph ph-house" />
            </RouterLink>
        </template>
        <template #content>
            <template
                v-for="route in $router
                    .getRoutes()
                    .filter(
                        (a) =>
                            a.path.startsWith($route.path) &&
                            a.path !== $route.path &&
                            !a.path.includes('storage/')
                    )"
                :key="route.path"
            >
                <div class="mb-2">
                    <RouterLink :to="route.path">
                        <Button>
                            {{
                                (route.name?.toString() ?? route.path)
                                    .replace($route.path, '')
                                    .replace(/^\//, '')
                            }}
                        </Button>
                    </RouterLink>
                </div>
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
{
    "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
    "name": "Dev"
}
</route>
