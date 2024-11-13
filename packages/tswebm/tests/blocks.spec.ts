import { readFile } from 'fs/promises';
import path from 'path';
import { test } from 'vitest';
import { Block, WebmReader } from '..';

test('Block count', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test1.mkv`))
    ).buffer;

    const demuxer = new WebmReader();

    const blockFn = vi.fn(() => {});
    demuxer.on('block', blockFn);

    demuxer.on('chunkDone', () => {
        expect(blockFn).toHaveBeenCalledTimes(2582);
    });

    demuxer.appendChunk(buffer);
});

test('Block data size', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test1.mkv`))
    ).buffer;

    const demuxer = new WebmReader();

    const blockFn = vi.fn((block: Block) => {
        expect(block.data.byteLength).toBeGreaterThan(1);
    });
    demuxer.on('block', blockFn);

    demuxer.on('chunkDone', () => {
        expect(blockFn).toHaveBeenCalledTimes(2582);
    });

    demuxer.appendChunk(buffer);
});
