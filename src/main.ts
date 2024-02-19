import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { createRouter, createWebHistory, setupDataFetchingGuard } from 'vue-router/auto';
import { GesturePlugin } from '@vueuse/gesture';
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

app.use(createPinia());
app.use(router);
app.use(GesturePlugin);

app.mount('#app');
