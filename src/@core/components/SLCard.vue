<template>
    <div
        :class="{
            card: true,
            ['shadow-' + (shadowSize ?? 'xl')]: true,
            'card-compact': compact
        }"
    >
        <figure v-if="img && !imgBottom">
            <img :src="img" />
        </figure>
        <div class="card-body">
            <h2 v-if="$slots.title || title" class="card-title">
                <template v-if="title">
                    {{ title }}
                </template>
                <slot v-else name="title" />
            </h2>
            <slot />
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
    shadowSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | (string & {});
    compact?: boolean;
    title?: string;
}>();
</script>
