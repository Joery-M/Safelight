import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'Home', component: () => import('./views/index.vue') },
    { path: '/projects', name: 'Projects', component: () => import('./views/projects.vue') },
    {
        path: '/editor/:projectId(.*)?',
        name: 'Editor',
        component: () => import('./views/editor.vue')
    }
];

const devRoutes: RouteRecordRaw[] = [
    { path: '/dev', name: 'Dev', component: () => import('./views/dev/index.vue') },
    { path: '/dev/daguerreo', component: () => import('./views/dev/Daguerreo.vue') },
    { path: '/dev/demuxing', component: () => import('./views/dev/Demuxing.vue') },
    { path: '/dev/localization', component: () => import('./views/dev/Localization.vue') },
    { path: '/dev/packages', component: () => import('./views/dev/Packages.vue') },
    { path: '/dev/timeline', component: () => import('./views/dev/devTimeline.vue') },
    { path: '/dev/ui', component: () => import('./views/dev/UI.vue') },

    // Storage
    { path: '/dev/storage', component: () => import('./views/dev/storage/index.vue') },
    { path: '/dev/storage/media', component: () => import('./views/dev/storage/Media.vue') },
    { path: '/dev/storage/projects', component: () => import('./views/dev/storage/Projects.vue') }
];

export const router = createRouter({
    history: createWebHistory('/'),
    routes: [...routes, ...devRoutes]
});
