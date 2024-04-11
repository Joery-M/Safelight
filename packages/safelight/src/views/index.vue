<template>
    <RouterLink to="/dev"> <Button>test</Button> </RouterLink>
    <RouterLink to="/projects"> <Button>Projects</Button> </RouterLink>
    <RouterLink to="/editor"> <Button>To Editor</Button> </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<route lang="json">
{ "name": "Home" }
</route>
