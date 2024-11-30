import type { Promisable } from 'type-fest';

export class Daguerreo {
    private source: DaguerreoSourceEffect | undefined;
    readonly effects: DaguerreoTransformEffect[] = [];

    addEffect(effect: DaguerreoTransformEffect) {
        this.effects.push(effect);
    }
    removeEffect(effect: DaguerreoTransformEffect) {
        this.effects.slice(this.effects.indexOf(effect) - 1, 1);
    }
    setSource(source: DaguerreoSourceEffect) {
        this.source = source;
    }

    async process(config: DaguerreoSourcePayload): Promise<DaguerreoResult> {
        const effectBase = this.source;
        if (!effectBase) throw new Error('No source effect defined');

        await effectBase.load?.();

        const payload = await effectBase.source(config);

        // Run initialize methods
        const initFunctions = this.effects
            .map((e) => e.sourceInitialized?.({ height: payload.height, width: payload.width }))
            .filter((p) => !!p);
        await Promise.allSettled(initFunctions);

        // Run effects
        for await (const effect of this.effects) {
            await effect.transform(payload);
        }

        return {
            width: payload.width,
            height: payload.height,
            image: payload.ctx.canvas.transferToImageBitmap(),
            matrix: payload.matrix
        };
    }
}

export interface DaguerreoTransformEffect {
    name: string;
    load?: () => Promisable<void>;
    sourceInitialized?: (
        config: Pick<DaguerreoTransformPayload, 'width' | 'height'>
    ) => Promisable<void>;
    transform: (config: DaguerreoTransformPayload) => Promisable<void>;
}
export interface DaguerreoSourceEffect {
    name: string;
    load?: () => Promisable<void>;
    source: (config: DaguerreoSourcePayload) => Promisable<DaguerreoTransformPayload>;
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

export interface DaguerreoTransformPayload {
    /**
     * Current frame number
     */
    frame: number;
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

    ctx: OffscreenCanvasRenderingContext2D;

    matrix: DOMMatrix;
}

export interface DaguerreoResult {
    /**
     * Current frame width
     */
    width: number;
    /**
     * Current frame height
     */
    height: number;

    image: ImageBitmap;

    matrix: DOMMatrix;
}
