<template>
    <p v-if="!item" class="w-full text-center">
        {{ $t('panels.item-properties.none-selected') }}
    </p>
    <div v-else>
        <ol>
            <li v-for="effect in item.effects" :key="effect.id">
                <template
                    v-if="
                        effect.effect.properties && Object.keys(effect.effect.properties).length > 0
                    "
                >
                    <!-- Effect with properties -->
                    <button
                        :aria-controls="effect.id"
                        :aria-expanded="collapsedEffects.has(effect)"
                        @click="
                            collapsedEffects.has(effect)
                                ? collapsedEffects.delete(effect)
                                : collapsedEffects.add(effect)
                        "
                    >
                        <span
                            :class="[
                                collapsedEffects.has(effect)
                                    ? 'i-ph-caret-right'
                                    : 'i-ph-caret-down',
                                'size-5',
                                'inline-block'
                            ]"
                        />
                        {{ effect.effect.name }}
                    </button>
                    <ul :id="effect.id">
                        <li v-for="(prop, key) in effect.effect.properties" :key="key">
                            <td>
                                {{ key }}
                            </td>
                            <!-- TODO: try to separate these out -->
                            <td v-if="prop.type === 'number'">
                                <InputNumber
                                    v-if="!prop.meta?.slider"
                                    :model-value="
                                        prop.displayValue ? prop.displayValue() : prop.value()
                                    "
                                    :max-fraction-digits="prop.meta?.integerOnly ? 0 : 10"
                                    :min="prop.meta?.min"
                                    :max="prop.meta?.max"
                                    :step="prop.meta?.step"
                                    @value-change="prop.setValue($event)"
                                />
                                <Slider
                                    v-else
                                    :model-value="
                                        prop.displayValue ? prop.displayValue() : prop.value()
                                    "
                                    :min="prop.meta?.min"
                                    :max="prop.meta?.max"
                                    :step="prop.meta?.step"
                                    @value-change="prop.setValue($event)"
                                />
                            </td>
                            <td v-else-if="prop.type === 'boolean'">
                                <Checkbox
                                    :model-value="
                                        prop.displayValue ? prop.displayValue() : prop.value()
                                    "
                                    @value-change="prop.setValue($event)"
                                />
                            </td>
                            <td v-else-if="prop.type === 'string'">
                                <InputText
                                    v-if="!prop.meta?.textArea"
                                    :model-value="
                                        prop.displayValue ? prop.displayValue() : prop.value()
                                    "
                                    @value-change="prop.setValue($event)"
                                />
                                <Textarea
                                    v-else
                                    :model-value="
                                        prop.displayValue ? prop.displayValue() : prop.value()
                                    "
                                    @value-change="prop.setValue($event)"
                                />
                            </td>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <!-- Effect without properties -->
                    <p>{{ effect.effect.name }}</p>
                </template>
            </li>
        </ol>
    </div>
</template>

<script setup lang="ts">
import { useEditor } from '@/stores/useEditor';
import type { EffectInstance } from '@safelight/shared/Effects/effectInstance';
import { Checkbox, InputNumber, InputText, Slider, Textarea } from 'primevue';
import { computed, shallowReactive } from 'vue';

const editor = useEditor();

const item = computed(() => editor.selectedTimelineItem);
const collapsedEffects = shallowReactive(new WeakSet<EffectInstance>());
</script>
