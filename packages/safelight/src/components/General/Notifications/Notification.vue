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
            <Button text severity="secondary" rounded @click="closeNotif">
                <template #icon>
                    <PhX />
                </template>
            </Button>
        </template>
        <p class="mb-0">{{ notif.config.text }}</p>
        <div v-if="buttons.length > 0" class="align-items-center mt-4 flex gap-2">
            <template v-for="(btn, i) in buttons" :key="i">
                <Button
                    :outlined="btn.type !== 'filled'"
                    @click="
                        (event: MouseEvent) => {
                            if (btn.onClick) {
                                btn.onClick(event, props.notif);
                            }
                        }
                    "
                >
                    {{ btn.label }}
                </Button>
            </template>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { PhInfo, PhWarning, PhWarningCircle, PhX } from '@phosphor-icons/vue';
import {
    NotificationService,
    type Notification
} from '@safelight/shared/UI/Notifications/NotificationService';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import { computed } from 'vue';

const props = defineProps<{
    notif: Notification;
}>();

const buttons = computed(() => props.notif.config.buttons ?? []);

function closeNotif() {
    NotificationService.close(props.notif);
}
</script>

<style lang="scss" scoped>
.notification {
    min-width: min(24em, 100vw);
    width: 35em;

    user-select: text;
    pointer-events: all;

    :deep(.p-panel-header) {
        padding: 0.75em 0.25em 0 1em;
        justify-content: flex-start;
        gap: 0.5em;
        h3 {
            margin: 0;

            flex-grow: 1;
        }

        > button {
            opacity: 0;
            transition: 100ms opacity;
        }
    }
    &:hover :deep(.p-panel-header) > button {
        opacity: 1;
    }
    :deep(.p-panel-content) {
        padding: 0 1em 1em 1em;

        p {
            white-space: preserve;
            padding-right: 1.5em;
        }
    }
}
</style>
