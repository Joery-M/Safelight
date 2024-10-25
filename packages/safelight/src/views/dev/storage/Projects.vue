<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev/storage">
                <Button icon="ph ph-arrow-left" />
            </RouterLink>
        </template>
        <template #content></template>
    </Card>
</template>

<script lang="ts" setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import { RouterLink } from 'vue-router';
</script>
