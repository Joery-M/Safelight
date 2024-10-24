import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

export const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        ...routes,
        {
            name: 'Editor',
            path: '/editor/:projectId(.*)?',
            component: () => import('./views/editor.vue')
        }
    ]
});
