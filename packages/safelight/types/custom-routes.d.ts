export {};
import type { ParamValueZeroOrOne, RouteRecordInfo } from 'vue-router';

declare module 'vue-router/auto-routes' {
    export interface RouteNamedMap {
        Editor: RouteRecordInfo<
            'Editor',
            '/editor/[[...projectId]]',
            { projectId: ParamValueZeroOrOne<true> },
            { projectId: ParamValueZeroOrOne<false> }
        >;
    }
}
