import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { createRouter, createWebHistory, setupDataFetchingGuard } from 'vue-router/auto';
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

app.mount('#app');
