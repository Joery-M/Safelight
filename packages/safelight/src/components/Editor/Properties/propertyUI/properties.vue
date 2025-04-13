<template>
    <tr v-for="(prop, key) in props" :key="key">
        <td>
            {{ key }}
        </td>
        <td v-if="prop.type === 'number'">
            <NumberProp :prop-key="(key as string)" :prop :effect />
        </td>
        <td v-else-if="prop.type === 'boolean'">
            <BooleanProp :prop-key="(key as string)" :prop :effect />
        </td>
        <td v-else-if="prop.type === 'string'">
            <StringProp :prop-key="(key as string)" :prop :effect />
        </td>
        <td v-else-if="prop.type === 'MediaItem'">
            <MediaItemProp :prop-key="(key as string)" :prop :effect />
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { SLEffectProperties } from '@safelight/shared/Effects/transformEffect';
import type { EffectInstance } from '@safelight/shared/Effects/effectInstance';
import type { SourceEffectInstance } from '@safelight/shared/Effects/SourceEffectInstance';
import { defineProps } from 'vue';
import BooleanProp from './boolean.vue';
import MediaItemProp from './mediaItem.vue';
import NumberProp from './number.vue';
import StringProp from './string.vue';

defineProps<{ props: SLEffectProperties; effect: SourceEffectInstance | EffectInstance }>();
</script>
