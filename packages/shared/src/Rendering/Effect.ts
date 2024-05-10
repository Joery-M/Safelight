import { ref, shallowRef } from 'vue';
import type { AnyObjectSchema, InferType, ObjectSchema } from 'yup';
import type { MaybePromiseResult } from '../../types/MaybePromise';
import type { SimpleTimelineConfig } from '../Timeline/SimpleTimeline';

export default abstract class Effect<
    Params = any,
    Properties extends AnyObjectSchema = ObjectSchema<{}>
> {
    public abstract name: string;
    public abstract version: string;

    public _params?: Params;
    public propertySchema = shallowRef<Properties>({} as Properties);
    public properties = ref({});
    public abstract renderer: EffectRenderer<Params>;

    /**
     * Set data to send to the renderer.
     *
     * @param params Data you need to send to the render method.
     */
    protected setRenderParams(params: Params) {
        this._params = params;
    }

    /**
     * Ran when this effect is initialized.
     *
     * Can be used for setting properties schema.
     */
    initialize?(meta: EffectMetaInfo<Properties>): void;

    /**
     * Ran just before rendering the frame for this effect.
     */
    preRender?(meta: EffectMetaInfo<Properties>): void;
    /**
     * Ran after all effects are done.
     *
     * If multiple effects use `postRender`, they will be executed in the order of the effects.
     */
    postRender?(meta: EffectMetaInfo<Properties>): void;
}

export abstract class EffectRenderer<
    Params = any,
    Properties extends AnyObjectSchema = AnyObjectSchema
> {
    render?(
        ctx: OffscreenCanvasRenderingContext2D,
        meta: EffectMetaInfo<Properties>,
        params?: Params
    ): MaybePromiseResult<any>;

    postRender?(
        ctx: OffscreenCanvasRenderingContext2D,
        meta: EffectMetaInfo<Properties>,
        params?: Params
    ): MaybePromiseResult<any>;
}

export interface EffectMetaInfo<Properties extends AnyObjectSchema = AnyObjectSchema> {
    timestamp: number;
    timeline: SimpleTimelineConfig;
    properties: InferType<Properties>;
}
