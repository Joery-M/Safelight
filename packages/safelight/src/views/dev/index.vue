<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/">
                <Button icon="ph ph-house" />
            </RouterLink>
        </template>
        <template #content>
            <template
                v-for="otherRoute in router
                    .getRoutes()
                    .filter(
                        (a) =>
                            a.path.startsWith(route.path) &&
                            a.path !== route.path &&
                            !a.path.includes('storage/')
                    )"
                :key="otherRoute.path"
            >
                <div class="mb-2">
                    <RouterLink :to="otherRoute.path">
                        <Button>
                            {{
                                (otherRoute.name?.toString() ?? otherRoute.path)
                                    .replace(route.path, '')
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
import { RouterLink, useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>
