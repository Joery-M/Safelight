<template>
    <div class="text-align-center">
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <p>Item properties</p>
        <p>{{ editor.selectedTimelineItem?.id }}</p>
    </div>
</template>

<script setup lang="ts">
import { useEditor } from '@/stores/useEditor';

const editor = useEditor();
</script>
