import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import App from './App.vue';

import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/aura-dark-amber/theme.css';
import Tooltip from 'primevue/tooltip';
import FocusTrap from 'primevue/focustrap';

import './style.scss';

export const router = createRouter({
    history: createWebHistory()
});

const app = createApp(App);

export const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    inputStyle: 'outlined',
    ripple: false
} as PrimeVueConfiguration);
app.use(ConfirmationService);
app.use(DialogService);

// Phosphor icons
app.provide('size', 18);

// Directives
app.directive('tooltip', Tooltip);
app.directive('focustrap', FocusTrap);

app.mount('#app');
