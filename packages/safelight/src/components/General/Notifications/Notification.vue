<template>
    <Panel
        class="notification"
        role="dialog"
        :aria-label="notif.config.title"
        :aria-describedby="notif.config.text"
        :aria-live="notif.config.severity == 'error' ? 'assertive' : 'polite'"
    >
        <template #header>
            <template v-if="notif.config.severity && notif.config.severity !== 'none'">
                <PhInfo v-if="notif.config.severity == 'info'" style="color: var(--blue-500)" />
                <PhWarningCircle
                    v-if="notif.config.severity == 'error'"
                    style="color: var(--red-500)"
                />
                <PhWarning v-if="notif.config.severity == 'warning'" />
            </template>
            <h3>{{ notif.config.title }}</h3>
        </template>
        <p class="mb-0">{{ notif.config.text }}</p>
        <div class="align-items-center mt-4 flex gap-2">
            <template v-for="(btn, i) in buttons" :key="i">
                <Button :outlined="btn.type !== 'filled'">
                    {{ btn.label }}
                </Button>
            </template>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import type { Notification } from '@safelight/shared/UI/Notifications/NotificationService';

const props = defineProps<{
    notif: Notification;
}>();

const buttons = computed(() => props.notif.config.buttons ?? []);
</script>

<style lang="scss" scoped>
.notification {
    min-width: min(24em, 100vw);

    :deep(.p-panel-header) {
        padding-top: 1em;
        padding-bottom: 0;
        justify-content: flex-start;
        gap: 0.5em;
        h3 {
            margin: 0;
        }
    }
    :deep(.p-panel-content) {
        padding-bottom: 0;
    }
}
</style>
