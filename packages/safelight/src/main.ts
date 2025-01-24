import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import { LocaleManager } from '@safelight/shared/Localization/LocaleManager';
import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import FocusTrap from 'primevue/focustrap';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';

import './style.scss';
import 'virtual:uno.css';
import { createI18n } from 'vue-i18n';
import { router } from './router';

const app = createApp(App);

export const pinia = createPinia();

// Setup timeline devtools
if (import.meta.env.DEV) {
    import('@safelight/timeline/devtools').then((dev) => {
        dev.setupDevtools(app);
    });
}

const mainTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fffcf4',
            100: '#fef0ca',
            200: '#fde3a1',
            300: '#fdd777',
            400: '#fccb4e',
            500: '#fbbf24',
            600: '#d5a21f',
            700: '#b08619',
            800: '#8a6914',
            900: '#644c0e',
            950: '#fbbf24'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#fbbf24',
                    inverseColor: '#ffffff',
                    hoverColor: '#644c0e',
                    activeColor: '#8a6914'
                },
                highlight: {
                    background: '#644c0e',
                    focusBackground: '#b08619',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '#fbbf24',
                    inverseColor: '#644c0e',
                    hoverColor: '#fcd34d',
                    activeColor: '#fde68a'
                },
                highlight: {
                    background: '#fbbf2429',
                    focusBackground: '#fbbf243d',
                    color: '#ffffffde',
                    focusColor: '#ffffffde'
                }
            }
        }
    }
});

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    inputStyle: 'outlined',
    ripple: false,
    theme: {
        preset: mainTheme,
        options: {
            darkModeSelector: '.dark',
            cssLayer: {
                name: 'primevue'
            }
        }
    }
} as PrimeVueConfiguration);
app.use(ConfirmationService);
app.use(DialogService);

// i18n
const i18n = createI18n<false>({
    locale: 'en-US',
    legacy: false,
    fallbackLocale: 'en-US',
    messages: {}
});
LocaleManager.init(i18n as any);
app.use(i18n);

// Phosphor icons
app.provide('size', 18);

// Directives
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);
app.directive('focustrap', FocusTrap);

app.mount('#app');
