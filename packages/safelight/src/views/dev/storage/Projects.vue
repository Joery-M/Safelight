<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev/storage">
                <Button>
                    <template #icon>
                        <PhArrowLeft />
                    </template>
                </Button>
            </RouterLink>
        </template>
        <template #content></template>
    </Card>
</template>

<script lang="ts" setup>
import { PhArrowLeft } from '@phosphor-icons/vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { RouterLink } from 'vue-router';
</script>
