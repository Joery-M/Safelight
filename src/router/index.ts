import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/editor',
            name: 'editor',
            component: () => import('../views/Editor.vue')
        },
        {
            path: '/dev',
            name: 'dev',
            children: [
                {
                    path: '',
                    component: () => import('../views/dev/dev.vue')
                },
                {
                    path: 'CodeEditor',
                    component: () => import('../views/dev/CodeEditor.vue')
                },
                {
                    path: 'ui',
                    component: () => import('../views/dev/UI.vue')
                }
            ]
        }
    ]
});

export default router;
