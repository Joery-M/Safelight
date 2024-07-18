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
            <p>
                {{ $t('general.actions.open') }}
            </p>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { PhArrowLeft } from '@phosphor-icons/vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router/auto';

const { t, d, n } = useI18n({
    inheritLocale: true
});
</script>

<route lang="json">
{ "path": "/dev/localization" }
</route>
