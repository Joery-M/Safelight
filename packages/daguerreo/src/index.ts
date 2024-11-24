import { defu } from 'defu';
import type { Promisable } from 'type-fest';

export class Daguerreo {
    private source: DaguerreoSourceEffect | undefined;
    private effects: DaguerreoTransformEffect[] = [];

    addEffect(effect: DaguerreoTransformEffect) {
        this.effects.push(effect);
    }
    removeEffect(effect: DaguerreoTransformEffect) {
        this.effects.slice(this.effects.indexOf(effect) - 1, 1);
    }
    setSource(source: DaguerreoSourceEffect) {
        if (this.source) {
            return;
        }
        this.source = source;
    }

    async process(config: DaguerreoSourcePayload) {
        const effectBase = this.source;
        if (!effectBase) throw new Error('No source effect defined');

        let payload = await effectBase.source(config);
        for await (const effect of this.effects) {
            const newConfig = await effect.transform(payload);
            if (newConfig) {
                payload = defu(newConfig, payload);
            }
        }

        return payload;
    }
}

export interface DaguerreoTransformEffect {
    name: string;
    type: 'transform';
    transform: (
        config: DaguerreoStreamPayload
    ) => Promisable<Partial<DaguerreoStreamPayload> | undefined>;
}
export interface DaguerreoSourceEffect {
    name: string;
    type: 'source';
    source: (config: DaguerreoSourcePayload) => Promisable<DaguerreoStreamPayload>;
}

export type DaguerreoEffect = DaguerreoSourceEffect | DaguerreoTransformEffect;

export interface DaguerreoSourcePayload {
    /**
     * Current frame number
     */
    frame: number;
    /**
     * Frame duration in milliseconds.
     */
    frameDuration: number;
    /**
     * Timeline width
     */
    width: number;
    /**
     * Timeline height
     */
    height: number;
}

export interface DaguerreoStreamPayload {
    /**
     * How long the current frame will last for in milliseconds.
     */
    frameDuration: number;
    /**
     * Current frame width
     */
    width: number;
    /**
     * Current frame height
     */
    height: number;

    data: ImageData;
}
