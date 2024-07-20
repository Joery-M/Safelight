<template>
    <RouterLink to="/dev"> <Button>test</Button> </RouterLink>
    <RouterLink to="/projects">
        <Button>{{ $t('general.descriptions.project', 2) }}</Button>
    </RouterLink>
    <RouterLink to="/editor"> <Button>To Editor</Button> </RouterLink>
</template>
<script setup lang="ts">
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';
</script>

<route lang="json">
{ "name": "Home" }
</route>
