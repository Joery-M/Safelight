<template>
    <div class="flex flex-col items-center justify-center">
        <p>{{ $t('panels.monitor.title') }}</p>
        <PlaybackControls />
    </div>
</template>

<script setup lang="ts">
import PlaybackControls from '../Timeline/PlaybackControls.vue';
</script>
