import { expect } from 'vitest';

export function showResult(result: ImageBitmap) {
    const canvas = document.createElement('canvas');
    canvas.style.maxWidth = '100vw';
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();

    ctx!.drawImage(result, 0, 0);
    result.close();

    document.body.appendChild(canvas);
}
