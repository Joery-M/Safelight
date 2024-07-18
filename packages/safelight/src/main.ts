import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
import App from './App.vue';

import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import { LocaleManager } from '@safelight/shared/Localization/LocaleManager.js';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';
import Ripple from 'primevue/ripple';
import FocusTrap from 'primevue/focustrap';

import './style.scss';

export const router = createRouter({
    history: createWebHistory('/'),
    routes: routes
});

const app = createApp(App);

export const pinia = createPinia();

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
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
} as PrimeVueConfiguration);
app.use(ConfirmationService);
app.use(DialogService);
app.use(LocaleManager.i18n);

// Phosphor icons
app.provide('size', 18);

// Directives
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);
app.directive('focustrap', FocusTrap);

app.mount('#app');
