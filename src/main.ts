import { createPinia } from 'pinia';
import { createApp } from 'vue';

import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config';
import 'primevue/resources/themes/aura-dark-amber/theme.css';
import { createRouter, createWebHistory, setupDataFetchingGuard } from 'vue-router/auto';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import SafelightTheme from '@/@core/Safelight';
import App from './App.vue';
import './style.scss';

const router = createRouter({
    history: createWebHistory(),
    extendRoutes: (routes) => {
        return routes;
    }
});

setupDataFetchingGuard(router);

const app = createApp(App);

export const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    pt: SafelightTheme,
    ripple: false
} as PrimeVueConfiguration);

app.mount('#app');
