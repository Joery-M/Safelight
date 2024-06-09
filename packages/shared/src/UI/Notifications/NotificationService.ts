import { ref, shallowReactive, type Component, type Raw } from 'vue';
import { type ButtonProps } from 'primevue/button';
import { v4 as uuidv4 } from 'uuid';

export class NotificationService {
    static activeNotifications = shallowReactive(new Set<Notification>());

    static notify(config: NotificationConfig) {
        const notif = new Notification(config);
        this.activeNotifications.add(notif);

        return notif;
    }

    static removeNotification(notif: Notification) {
        notif.destroy();

        this.activeNotifications.delete(notif);
    }
}

export class Notification {
    id: string;
    loadingPercent = ref(0);
    private hideTimeout?: ReturnType<typeof setTimeout>;

    constructor(public config: NotificationConfig) {
        this.id = uuidv4();
        if (!config.title?.trim() && !config.text?.trim()) {
            throw new Error('Tried creating a notification without a title or text');
        }

        if (config.autoHide) {
            this.hideTimeout = setTimeout(() => {
                NotificationService.removeNotification(this);
            }, config.autoHideDelay ?? 15000);
        }
    }

    /**
     *
     * @param percent number
     * range of 0 to 1 of the loading progress.
     *
     * Set to -1 to set the loading bar to be indeterminate.
     */
    setLoadingPercent(percent: number) {
        this.loadingPercent.value = percent;
    }

    destroy() {
        clearTimeout(this.hideTimeout);
    }
}

export interface NotificationConfig {
    /**
     * Icon to show in the notification
     *
     * @default 'none'
     */
    severity?: NotificationSeverity;
    buttons?: NotificationButton[];
    title?: string;
    text?: string;
    /**
     * Whether this notification can be clicked away
     *
     * @default true
     */
    dismissible?: boolean;
    /**
     * Whether this notification should display a loading bar
     *
     * Can be controlled with {@link Notification.setLoadingPercent}
     *
     * @default false
     */
    loading?: boolean;
    /**
     * Whether to automatically hide the notification after a delay
     *
     * @default false
     */
    autoHide?: boolean;
    /**
     * Time in milliseconds representing how long to show the notification for
     *
     * @default 15000
     */
    autoHideDelay?: number;
}

export interface NotificationButton {
    label: string;
    /**
     * Type of button to show
     *
     * @default 'outlined'
     */
    type: NotificationButtonType;
    onClick: (event: MouseEvent) => any;
}

export type NotificationButtonType = 'filled' | 'outlined';
export type NotificationSeverity = 'info' | 'warning' | 'error' | 'none';
