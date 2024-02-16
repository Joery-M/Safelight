<template>
    <SLCard title="Buttons">
        <SLButton size="sm"> Small </SLButton>
        <SLButton size="md"> Medium </SLButton>
        <SLButton size="lg"> Large </SLButton>
        <SLButton size="xl"> Extra Large </SLButton>
    </SLCard>

    <SLCard title="Button wide">
        <SLButton wide>Wide</SLButton>
    </SLCard>

    <SLCard title="Button states">
        <SLButton outline>Outline</SLButton>
        <SLButton square>Colorado</SLButton>
        <SLButton circle>Circle</SLButton>
        <SLButton active>Active</SLButton>
        <SLButton disabled>Disabled</SLButton>
    </SLCard>

    <SLCard title="Icons">
        <SLButton loading />
        <SLButton loading>Loading text</SLButton>
        <SLButton loading square />
        <SLButton square>
            <PhFileVue />
        </SLButton>
        <SLButton circle>
            <PhPlus />
        </SLButton>
    </SLCard>
</template>

<script setup lang="ts">
import { PhFileVue, PhPlus } from '@phosphor-icons/vue';
</script>
