import type { ParamValueZeroOrOne, RouteRecordInfo } from 'vue-router';

export interface RouteNamedMap {
    Editor: RouteRecordInfo<
        'Editor',
        '/editor/[[...projectId]]',
        { projectId: ParamValueZeroOrOne<true> },
        { projectId: ParamValueZeroOrOne<false> }
    >;
}

declare module 'vue-router' {
    interface TypesConfig {
        RouteNamedMap: RouteNamedMap;
    }
}
