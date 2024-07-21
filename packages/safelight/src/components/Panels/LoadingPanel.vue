<template>
    <div class="grid h-full w-full place-content-center">
        <PhCircleNotch class="animate-spin" :aria-label="$t('general.loading')" size="48" />
    </div>
</template>

<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue';
</script>
