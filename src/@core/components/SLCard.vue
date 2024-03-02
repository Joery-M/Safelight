<template>
    <Card :title="title">
        <template #title>
            <template v-if="title">
                {{ title }}
            </template>
            <slot v-else name="title" />
        </template>
        <template v-if="img" #header>
            <img role="figure" :src="img" :alt="imgAlt" />
        </template>
        <template #content>
            <slot />
        </template>
        <template v-if="$slots.actions" #footer>
            <slot
                name="actions"
                :class="{
                    ['justify-' + (buttonAlign ?? 'end')]: true,
                    'card-actions': true
                }"
            >
            </slot>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';

defineProps<{
    img?: string;
    imgAlt?: string;
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
    title?: string;
}>();
</script>
