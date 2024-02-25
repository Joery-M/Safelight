<template>
    <SLButton to="/">
        <template #icon>
            <PhHouse />
        </template>
    </SLButton>
    <SLButton to="/dev/CodeEditor"> Code Editor </SLButton>
    <SLButton to="/dev/UI"> UI </SLButton>
</template>

<script setup lang="ts">
import { PhHouse } from '@phosphor-icons/vue';
</script>

<route lang="json">
{ "path": "/dev" }
</route>
