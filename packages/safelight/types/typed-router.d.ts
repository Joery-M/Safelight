import type { RouteRecordInfo } from 'vue-router';

export interface RouteNamedMap {
    Editor: RouteRecordInfo<
        'Editor',
        '/editor/:projectId(.*)?',
        { projectId?: string },
        { projectId?: string }
    >;
}
declare module 'vue-router' {
    interface TypesConfig {
        RouteNamedMap: RouteNamedMap;
    }
}
