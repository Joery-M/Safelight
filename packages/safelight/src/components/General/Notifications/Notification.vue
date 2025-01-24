<template>
    <Panel
        class="notification"
        role="dialog"
        :aria-label="$t(notif.config.title ?? '', 'notification.defaultTitle')"
        :aria-describedby="'content-' + notif.id"
        :aria-live="notif.config.severity == 'error' ? 'assertive' : 'polite'"
    >
        <template #header>
            <template v-if="notif.config.severity && notif.config.severity !== 'none'">
                <i
                    v-if="notif.config.severity == 'info'"
                    class="ph ph-info"
                    style="color: var(--blue-500)"
                />
                <i
                    v-if="notif.config.severity == 'error'"
                    class="ph ph-warning-circle"
                    style="color: var(--red-500)"
                />
                <i v-if="notif.config.severity == 'warning'" class="ph ph-warning" />
            </template>
            <h3>{{ $t(notif.config.title ?? '', 'notification.defaultTitle') }}</h3>
            <Button text severity="secondary" rounded icon="ph ph-x" @click="closeNotif" />
        </template>
        <p :id="'content-' + notif.id" class="mb-0">{{ $t(notif.config.text ?? '') }}</p>
        <div v-if="buttons.length > 0" class="mt-4 flex items-center gap-2">
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
                    {{ $t(btn.label ?? '') }}
                </Button>
            </template>
        </div>
    </Panel>
</template>

<script setup lang="ts">
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
