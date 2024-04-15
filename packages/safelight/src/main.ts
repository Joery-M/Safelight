import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto';
import App from './App.vue';

import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/aura-dark-amber/theme.css';
import Tooltip from 'primevue/tooltip';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// import SafelightTheme from '@/@core/Safelight';

import './style.scss';

export const router = createRouter({
    history: createWebHistory()
});

const app = createApp(App);

export const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    // pt: SafelightTheme,
    inputStyle: 'outlined',
    ripple: false
} as PrimeVueConfiguration);

// Directives
app.directive('tooltip', Tooltip);

app.mount('#app');
