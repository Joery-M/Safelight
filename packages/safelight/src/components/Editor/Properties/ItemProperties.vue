<template>
    <p v-if="!item" class="w-full text-center">
        {{ $t('panels.item-properties.none-selected') }}
    </p>
    <div v-else>
        <ol>
            <li v-for="source in item.sources" :key="source.id">
                <button
                    :aria-controls="source.id"
                    :aria-expanded="collapsedEffects.has(source)"
                    @click="
                        collapsedEffects.has(source)
                            ? collapsedEffects.delete(source)
                            : collapsedEffects.add(source)
                    "
                >
                    <span
                        :class="[
                            collapsedEffects.has(source) ? 'i-ph-caret-right' : 'i-ph-caret-down',
                            'size-5',
                            'inline-block'
                        ]"
                    />

                    {{ $t('effect.builtin.' + source.source.name) }}
                </button>
                <table v-if="!collapsedEffects.has(source)" :id="source.id">
                    <Properties :props="source.source.properties ?? {}" :effect="source" />
                </table>
            </li>
        </ol>
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

                        {{ $t('effect.builtin.' + effect.effect.name) }}
                    </button>
                    <table v-if="!collapsedEffects.has(effect)" :id="effect.id">
                        <Properties :props="effect.effect.properties ?? {}" :effect />
                    </table>
                </template>
                <template v-else>
                    <!-- Effect without properties -->
                    <p>{{ effect.effect.name }}</p>
                </template>
            </li>
        </ol>
        <div w-full flex justify-center>
            <Button
                icon="i-ph-plus"
                :label="$t('panels.item-properties.add-effect')"
                @click="effectPopover?.toggle"
            />
        </div>
        <Popover ref="add-effect-popover" :pt="{ content: { class: 'p-0' } }">
            <Tree
                :value="allEffects"
                w-80
                rounded-full
                p-1
                selection-mode="single"
                @node-select="$event.data && addEffect($event.data)"
            >
            </Tree>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import { useEditor } from '@/stores/useEditor';
import { EffectInstance } from '@safelight/shared/Effects/effectInstance';
import { EffectManager } from '@safelight/shared/Effects/EffectManager';
import { SourceEffectInstance } from '@safelight/shared/Effects/SourceEffectInstance';
import { Button, Popover, Tree } from 'primevue';
import type { TreeNode } from 'primevue/treenode';
import { computed, shallowReactive, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Properties from './propertyUI/properties.vue';

const editor = useEditor();

const effectPopover = useTemplateRef('add-effect-popover');

const item = computed(() => editor.selectedTimelineItem);
const collapsedEffects = shallowReactive(new WeakSet<EffectInstance | SourceEffectInstance>());

const i18n = useI18n();

const allEffects = computed<TreeNode[]>(() => {
    const grouped = Object.groupBy(EffectManager.effectMap.values(), (item) => item.category);
    return Object.entries(grouped).map(([category, effects]) => {
        return {
            label: i18n.t('effect.categories.' + category, category),
            key: category,
            data: category,
            selectable: false,
            children: effects?.map((effect) => {
                return {
                    label: i18n.t('effect.builtin.' + effect.name, effect.name),
                    key: category + '-' + effect.name,
                    data: effect.name,
                    selectable: true
                } satisfies TreeNode;
            })
        } satisfies TreeNode;
    });
});

async function addEffect(name: string) {
    if (!item.value) return;

    const eff = await EffectManager.getEffect(name);
    if (eff) {
        if ('transform' in eff) {
            item.value.effects.push(new EffectInstance(item.value, eff));
        } else {
            item.value.sources.push(new SourceEffectInstance(item.value, eff));
        }
    }
}
</script>
