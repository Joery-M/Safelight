<template>
    <table class="timeline">
        <tr v-for="videoLayer in highestLayer + 1" :key="videoLayer"></tr>
    </table>
</template>

<script lang="ts" setup>
const project = useProject();
const timeline = project.activeTimeline;

const highestLayer = ref(1);

watch(timeline.items, () => {
    timeline.items.forEach((item) => {
        if (item.layer > highestLayer.value) {
            highestLayer.value = item.layer;
        }
    });
});
</script>

<style lang="scss" scoped>
.timeline {
    @apply flex w-full flex-col;

    tr {
        height: 2rem;

        @apply w-full odd:bg-base-200/60 even:bg-base-200/30;
    }
}

.divider {
    margin: 0;
    height: unset;
}

.container {
    height: 600px;

    @apply flex flex-col justify-center;

    div:not(.divider) {
        display: flex;

        &:first-child {
            justify-content: flex-end;
        }
    }
}
</style>
