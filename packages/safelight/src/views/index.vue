<template>
    <Card>
        <template #content>
            <RouterLink class="mb-2 block" to="/dev"> <Button>test</Button> </RouterLink>
            <RouterLink class="mb-2 block" to="/projects">
                <Button>{{ $t('general.descriptions.project', 2) }}</Button>
            </RouterLink>
            <RouterLink class="mb-2 block" to="/editor"> <Button>To Editor</Button> </RouterLink>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import { RouterLink } from 'vue-router';
</script>

<route lang="json">
{ "name": "Home" }
</route>
