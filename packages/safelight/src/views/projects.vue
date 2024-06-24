<template>
    <Card>
        <template #content>
            <ProjectList />
        </template>
    </Card>
</template>

<script setup lang="ts">
import ProjectList from '@/components/Menu/ProjectList/ProjectList.vue';
import Card from 'primevue/card';
</script>
