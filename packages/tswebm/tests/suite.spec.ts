import { readFile } from 'fs/promises';
import path from 'path';
import { MatroskaElements, WebmReader } from '../src/tswebm';

test('Block count', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test1.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    demuxer.on(MatroskaElements.Title, (title) => {
        expect(title).toBe('Big Buck Bunny - test 1');
    });
    demuxer.on(MatroskaElements.DateUTC, (title) => {
        console.log(title);
    });

    demuxer.appendChunk(buffer);
});
