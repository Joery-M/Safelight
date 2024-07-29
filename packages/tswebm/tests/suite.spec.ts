import { readFile } from 'fs/promises';
import path from 'path';
import { MatroskaElements, WebmReader } from '../src/tswebm';

test('test 1', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test1.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    demuxer.on(MatroskaElements.Title, (title) => {
        expect(title).toBe('Big Buck Bunny - test 1');
    });
    demuxer.on(MatroskaElements.DateUTC, (date) => {
        expect(date.getFullYear()).toBe(2010);
    });

    demuxer.appendChunk(buffer);
});

test('test 2', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test2.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    demuxer.on(MatroskaElements.Title, (title) => {
        expect(title).toBe('Elephant Dream - test 2');
    });
    demuxer.on(MatroskaElements.DateUTC, (date) => {
        expect(date.getFullYear()).toBe(2011);
    });

    demuxer.appendChunk(buffer);
});

test('test 3', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test3.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    demuxer.on(MatroskaElements.Title, (title) => {
        expect(title).toBe('Elephant Dream - test 3');
    });
    demuxer.on(MatroskaElements.DateUTC, (date) => {
        expect(date.getFullYear()).toBe(2010);
    });

    demuxer.appendChunk(buffer);
});

test('test 4', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test4.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    demuxer.on(MatroskaElements.Title, (title) => {
        expect(title).toBe('Elephant Dream - test 3');
    });
    demuxer.on(MatroskaElements.DateUTC, (date) => {
        expect(date.getFullYear()).toBe(2010);
    });

    demuxer.appendChunk(buffer);
});
