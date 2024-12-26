import { Daguerreo, defineEffect } from '@safelight/daguerreo';
import { GradientTestSource } from '@safelight/daguerreo/sources/TestSource';
import { expect, test } from 'vitest';
import { showResult } from './helpers';

test('defineEffect', async () => {
    const testSource = GradientTestSource();
    const sourceFn = vi.spyOn(testSource, 'source');

    const transformFn = vi.fn(() => {});

    const myEffect = defineEffect({
        name: 'test-effect',
        transform: transformFn
    });

    const dg = new Daguerreo();

    expect(dg.effects).toHaveLength(0);
    dg.addEffect(myEffect);
    expect(dg.effects).toHaveLength(1);

    dg.setSource(testSource);

    expect(transformFn).not.toHaveBeenCalled();
    expect(sourceFn).not.toHaveBeenCalled();

    const processRes = await dg.process({
        frame: 0,
        frameDuration: 1 / 60,
        height: 720,
        width: 1280,
        quality: 'final'
    });

    expect(processRes).toBeDefined();
    expect(processRes.image.height).toBe(720);
    expect(processRes.image.width).toBe(1280);
    expect(transformFn).toHaveBeenCalled();
    expect(sourceFn).toHaveBeenCalled();

    showResult(processRes.image);
});
