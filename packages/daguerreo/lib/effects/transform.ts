import Effect, { EffectRenderer, type EffectMetaInfo } from '@safelight/shared/Rendering/Effect';
import { number, object, ObjectSchema, tuple, type AnyObject } from 'yup';

const transformProps = object({
    scale: number().min(0).default(1).meta({}),
    position: tuple([number().default(0), number().default(0)])
        .default([0, 0])
        .required(),
    rotation: number().default(0)
});

export default class TransformEffect extends Effect<any, typeof transformProps> {
    public name = 'Transform';
    public version = '1.0.0';
    public renderer = new TransformRenderer();

    initialize(): void {
        this.propertySchema.value = transformProps;
    }
}

class TransformRenderer extends EffectRenderer<any, typeof transformProps> {
    render(ctx: OffscreenCanvasRenderingContext2D, meta: EffectMetaInfo<typeof transformProps>) {
        console.log(meta.properties);
    }
}
