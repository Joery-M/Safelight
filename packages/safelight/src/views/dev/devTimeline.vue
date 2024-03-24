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
                <Timeline :items="items" invert- />
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import type { TimelineItem } from '@safelight/timeline';
import { Timeline } from '@safelight/timeline';
import { v4 as uuidv4 } from 'uuid';

const items = reactive<TimelineItem[]>([
    {
        id: uuidv4(),
        name: '100 start',
        start: 100,
        duration: 500,
        layer: 0
    },
    {
        id: uuidv4(),
        name: '588 start',
        start: 588,
        duration: 515,
        layer: 5
    },
    {
        id: uuidv4(),
        name: '314 start',
        start: 314,
        duration: 749,
        layer: 2
    },
    {
        id: uuidv4(),
        name: '300 start',
        start: 300,
        duration: 263,
        layer: 3
    },
    {
        id: uuidv4(),
        name: '30 start',
        start: 30,
        duration: 770,
        layer: 17
    },
    {
        id: uuidv4(),
        name: '664 start',
        start: 664,
        duration: 266,
        layer: 4
    },
    {
        id: uuidv4(),
        name: '366 start',
        start: 366,
        duration: 135,
        layer: 6
    },
    {
        id: uuidv4(),
        name: '380 start',
        start: 380,
        duration: 451,
        layer: 1
    }
]);
</script>

<style>
html,
body {
    overscroll-behavior-x: none;
}
</style>

<route lang="json">
{ "path": "/dev/timeline" }
</route>
