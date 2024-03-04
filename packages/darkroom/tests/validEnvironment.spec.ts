import { expect, test } from 'vitest';

test('Test environment validity', () => {
    expect(new TextEncoder().encode('') instanceof Uint8Array).toBeTruthy();
});
