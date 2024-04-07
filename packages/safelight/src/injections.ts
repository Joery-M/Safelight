import type BaseProject from '@safelight/shared/base/Project';
import type BaseTimeline from '@safelight/shared/base/Timeline';
import type { InjectionKey } from 'vue';

export const CURRENT_PROJECT: InjectionKey<BaseProject> = Symbol('current.project');
export const CURRENT_TIMELINE: InjectionKey<BaseTimeline> = Symbol('current.timeline');
