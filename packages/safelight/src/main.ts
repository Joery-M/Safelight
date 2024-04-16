import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import App from './App.vue';

import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/aura-dark-amber/theme.css';
import Tooltip from 'primevue/tooltip';

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

// Directives
app.directive('tooltip', Tooltip);

app.mount('#app');
