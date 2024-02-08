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
    @apply w-full flex flex-vertical flex-col;

    tr {
        height: 2rem;

        @apply odd:bg-base-200/60 even:bg-base-200/30 w-full;
    }
}

.divider {
    margin: 0;
    height: unset;
}

.container {
    height: 600px;

    @apply flex flex-justify-center flex-col;

    div:not(.divider) {
        display: flex;

        &:first-child {
            justify-content: flex-end;
        }
    }
}
</style>
