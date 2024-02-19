<template>
    <SLButton size="sm">test</SLButton>
    <SLButton @click="$router.push('/editor')">To Editor</SLButton>
</template>
<script setup lang="ts"></script>

<route lang="json">
{ "name": "Home" }
</route>
