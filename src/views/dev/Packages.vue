<template>
    <div>
        <template
            v-for="(dep, title) in { ...packages.dependencies, ...packages.devDependencies }"
            :key="dep"
        >
            <p>{{ title }}</p>
            <a :href="dep.homepage || dep.repository.replace('git+', '')">Source</a>
            <p>{{ dep.license }}</p>
        </template>
    </div>
</template>

<script setup lang="ts">
import packages from '/public/packages.json';
</script>
