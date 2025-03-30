import { reactive } from 'vue';
import type { SLSourceEffect } from './sourceEffect';
import type { SLTransformEffect } from './transformEffect';

export interface EffectMeta {
    name: string;
    category: string;
}

export interface EffectLoader extends EffectMeta {
    load: () => Promise<SLSourceEffect | SLTransformEffect>;
}

export class EffectManager {
    static effectMap = reactive(new Map<string, EffectLoader>());

    static registerEffect(name: string, effectLoader: EffectLoader) {
        this.effectMap.set(name, effectLoader);
    }
    static getEffect(name: string) {
        return this.effectMap.get(name)?.load();
    }
}

const builtinEffects = import.meta.glob('./builtin/**/*.ts', { import: 'default' });
const builtinEffectMeta = import.meta.glob('./builtin/**/*.ts', { import: 'meta', eager: true });

for (const entry of Object.entries(builtinEffects)) {
    const meta = builtinEffectMeta[entry[0]] as EffectMeta;
    if (meta) {
        EffectManager.registerEffect(meta.name, {
            ...meta,
            async load() {
                const loader = await entry[1]();
                if (typeof loader === 'function') {
                    return loader() as SLSourceEffect | SLTransformEffect;
                } else {
                    return loader as SLSourceEffect | SLTransformEffect;
                }
            }
        });
    }
}
