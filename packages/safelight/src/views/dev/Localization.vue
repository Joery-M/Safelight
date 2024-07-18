<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button>
                    <template #icon>
                        <PhArrowLeft />
                    </template>
                </Button>
            </RouterLink>
        </template>
        <template #content>
            <div>
                <Select
                    :model-value="$i18n.locale"
                    :options="Object.keys(LocaleManager.locales)"
                    @update:model-value="LocaleManager.switchLocale($event)"
                ></Select>
                <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                <p><span>general.actions.search:</span> {{ $t('general.actions.search') }}</p>
            </div>
            <div>
                <InputText v-model="testPath" />
                <InputNumber v-model="testAmount" input-class="w-10" />
                <p>
                    {{ $t(testPath, testAmount) }}
                </p>
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { PhArrowLeft } from '@phosphor-icons/vue';
import { LocaleManager } from '@safelight/shared/Localization/LocaleManager';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const testPath = ref('general.descriptions.name');
const testAmount = ref(1);
</script>

<route lang="json">
{ "path": "/dev/localization" }
</route>
