import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { createRouter, createWebHistory, setupDataFetchingGuard } from 'vue-router/auto';
import PrimeVue from 'primevue/config';
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
    unstyled: true,
    pt: SafelightTheme
});

app.mount('#app');
