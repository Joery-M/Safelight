<template>
    <div
        :class="{
            card: true,
            'card-compact': compact,
            noMaxWidth
        }"
    >
        <figure v-if="img && !imgBottom">
            <img :src="img" />
        </figure>
        <div class="card-body">
            <h2 v-if="slots.title || title" class="card-title">
                <template v-if="title">
                    {{ title }}
                </template>
                <slot v-else name="title" />
            </h2>
            <div class="card-content">
                <slot />
            </div>
            <slot
                name="actions"
                :class="{
                    ['justify-' + (buttonAlign ?? 'end')]: true,
                    'card-actions': true
                }"
            >
            </slot>
        </div>
        <figure v-if="img && imgBottom">
            <img :src="img" />
        </figure>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    img?: string;
    imgBottom?: boolean;
    imgRounded?: boolean;
    noMaxWidth?: boolean;
    buttonAlign?:
        | 'normal'
        | 'start'
        | 'end'
        | 'center'
        | 'between'
        | 'around'
        | 'evenly'
        | 'stretch'
        | (string & {});
    compact?: boolean;
    title?: string;
}>();

const slots = defineSlots<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    title: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: any;
}>();
</script>

<style lang="scss" scoped>
.card {
    @apply m-2 rounded-2xl bg-neutral-800 p-4;

    > .card-body {
        > .card-title {
            @apply mb-4;
        }
    }

    &:not(.noMaxWidth) {
        @apply max-w-screen-md;
    }
}
</style>
