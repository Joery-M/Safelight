<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button icon="ph ph-arrow-left" />
            </RouterLink>
        </template>
        <template #content>
            <div>
                <Select
                    :model-value="$i18n.locale"
                    :options="allLocales"
                    option-label="displayName"
                    option-value="name"
                    @update:model-value="LocaleManager.switchLocale($event)"
                />
                <p><span>general.actions.search:</span> {{ $t('general.actions.search') }}</p>
            </div>
            <hr />
            <div>
                <h2>All translations</h2>
                <pre>{{ $t(Object.keys(previewPath)[0], previewAmount) }}</pre>
                <TreeSelect v-model="previewPath" :options="allPaths" class="w-80 leading-normal">
                    <template #value="{ value }">
                        <template v-if="value[0]"> {{ value[0].key }}</template>
                    </template>
                </TreeSelect>
                <InputNumber v-model="previewAmount" input-class="w-10" />
            </div>
            <hr />
            <div>
                <h2>Datetime</h2>
                <DatePicker
                    v-model="previewDt"
                    :disabled="dateTimeFormats.length == 0"
                    show-time
                    input-class="leading-normal"
                />
                <Select
                    v-model="previewDtFormat"
                    :disabled="dateTimeFormats.length == 0"
                    :options="dateTimeFormats"
                />
                <p v-if="previewDt && dateTimeFormats.length > 0">
                    {{ $d(previewDt, previewDtFormat) }}
                </p>
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { LocaleManager } from '@safelight/shared/Localization/LocaleManager';
import Button from 'primevue/button';
import Card from 'primevue/card';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import type { TreeNode } from 'primevue/treenode';
import TreeSelect from 'primevue/treeselect';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

const previewPath = ref<{ [path: string]: any }>({ 'general.descriptions.name': true });
const previewAmount = ref(1);

const previewDt = ref<Date>(new Date());
const previewDtFormat = ref<string>('long');

const i18n = useI18n();

const allLocales = computed(() =>
    Array.from(LocaleManager.locales.entries()).map(([name, reg]) => ({
        name,
        displayName: reg.localeName + ' - ' + name
    }))
);
const allPaths = computed(() => {
    if (i18n.locale.value == i18n.fallbackLocale.value.toString()) {
        return groupMessages(i18n.messages.value[i18n.locale.value]);
    }

    // Merge main and fallback
    const merged = mergeDeep(
        {},
        i18n.messages.value[i18n.locale.value],
        i18n.messages.value[i18n.fallbackLocale.value.toString()]
    );
    return groupMessages(merged);
});
const dateTimeFormats = computed(() => {
    if (i18n.datetimeFormats.value[LocaleManager.activeLocale.value]) {
        return Object.keys(i18n.datetimeFormats.value[LocaleManager.activeLocale.value]);
    } else {
        return [];
    }
});

// Modified from: https://gist.github.com/nombrekeff/7cc1711b20b6738b7d5e47b9acef32b5
function groupMessages(obj?: Record<string, any>, path: string[] = []) {
    if (typeof obj !== 'object') {
        return [];
    }

    const result: TreeNode[] = [];

    for (const key in obj) {
        const message = obj[key];
        if (typeof message === 'object') {
            const subMsgs = groupMessages(message, [...path, key]);
            const newItem: TreeNode = {
                label: key,
                key: [...path, key].join('.'),
                selectable: false,
                children: subMsgs
            };
            result.push(newItem);
        } else {
            result.push({
                label: key,
                key: [...path, key].join('.')
            });
        }
    }
    return result;
}

// Source: https://stackoverflow.com/a/34749873
function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
function mergeDeep(target: Record<string, any>, ...sources: Record<string, any>[]) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}
</script>
