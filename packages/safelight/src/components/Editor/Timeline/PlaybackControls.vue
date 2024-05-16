<template>
    <template v-if="timeline"> {{ timeline?.isPlaying.value }} </template>
</template>

<script lang="ts" setup>
const { project } = CurrentProject;
const timeline = computed(() =>
    project.value?.timeline.value?.isSimpleTimeline() ? project.value.timeline.value : undefined
);
</script>
