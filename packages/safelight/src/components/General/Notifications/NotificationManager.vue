<template>
    <ul class="notifications" role="listbox" :aria-label="firstNotif?.config.title">
        <TransitionGroup name="list">
            <template
                v-for="notification in NotificationService.activeNotifications"
                :key="notification.id"
            >
                <Notification class="notif" :notif="notification" />
            </template>
        </TransitionGroup>
    </ul>
</template>

<script setup lang="ts">
import { NotificationService } from '@safelight/shared/UI/Notifications/NotificationService';
import { computed } from 'vue';
import Notification from './Notification.vue';

const firstNotif = computed(() =>
    Array.from(NotificationService.activeNotifications.values()).at(-1)
);
</script>

<style lang="scss" scoped>
.notifications {
    position: fixed;
    bottom: 0;
    right: 0.5em;
    user-select: none;
    pointer-events: none;

    padding: 0;
    padding-top: 0.5em;
    margin: 0;
    list-style: none;
    z-index: 100;

    > .notif {
        margin-bottom: 0.5em;
    }
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from {
    transform: translateX(calc(100% + 1em));
}
.list-leave-to {
    // compensate for moving item down
    transform: translateX(calc(100% + 1em)) translateY(calc(-100% - 0.5em));
}

.list-leave-active {
    position: absolute;
}
</style>
