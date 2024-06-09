<template>
    <div class="notifications" role="listbox" :aria-label="firstNotif?.config.title">
        <template
            v-for="notification in NotificationService.activeNotifications"
            :key="notification.id"
        >
            <Notification :notif="notification" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { NotificationService } from '@safelight/shared/UI/Notifications/NotificationService';

const firstNotif = computed(() =>
    Array.from(NotificationService.activeNotifications.values()).at(-1)
);
</script>

<style lang="scss" scoped>
.notifications {
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    bottom: 0;
    right: 0;
}
</style>
