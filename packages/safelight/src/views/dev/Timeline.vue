<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button>
                    <template #icon>
                        <PhArrowLeft />
                    </template>
                </Button>
            </RouterLink>
        </template>
        <template #content>
            <div style="min-height: 250px">
                <Timeline :items="items" />
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import type { TimelineItem } from '@safelight/timeline';
import Timeline from '@safelight/timeline';
import { v4 as uuidv4 } from 'uuid';

const items = reactive<TimelineItem[]>([
    {
        id: uuidv4(),
        name: 'a',
        start: 100,
        duration: 1000
    }
]);
</script>

<style>
html,
body {
    overscroll-behavior-x: none;
}
</style>
