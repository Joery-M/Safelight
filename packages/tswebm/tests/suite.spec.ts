import { readFile } from 'fs/promises';
import path from 'path';
import { Elements, MatroskaElements, WebmReader } from '../src/tswebm';
import { XMLParser } from 'fast-xml-parser';

test.concurrent('test 1', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test1.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    const Tags: { Name: string; String: string }[] = new XMLParser().parse(
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test1-tag.xml`))
    )?.Tags?.Tag?.Simple;

    expectTypeOf(Tags).toBeArray();

    demuxer.on(MatroskaElements.SimpleTag, (tag) => {
        Tags.forEach((sourceTag) => {
            if (sourceTag.Name == tag.TagName) {
                expect(sourceTag.String.toString()).toBe(tag.TagString?.toString());
            }
        });
    });

    const releaseDateFn = vi.fn((date: Date) => {
        expect(date.getFullYear()).toBe(2010);
    });
    demuxer.on(MatroskaElements.DateUTC, releaseDateFn);

    demuxer.on('chunkDone', () => {
        expect(releaseDateFn).toHaveBeenCalledOnce();
    });
    demuxer.appendChunk(buffer);
});

test.concurrent('test 2', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test2.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    const Tags: { Name: string; String: string }[] = new XMLParser().parse(
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test2-tag.xml`))
    )?.Tags?.Tag?.Simple;

    expectTypeOf(Tags).toBeArray();

    demuxer.on(MatroskaElements.SimpleTag, (tag) => {
        Tags.forEach((sourceTag) => {
            if (sourceTag.Name == tag.TagName) {
                expect(sourceTag.String.toString()).toBe(tag.TagString?.toString());
            }
        });
    });

    const releaseDateFn = vi.fn((date: Date) => {
        expect(date.getFullYear()).toBe(2011);
    });
    demuxer.on(MatroskaElements.DateUTC, releaseDateFn);

    demuxer.on('chunkDone', () => {
        expect(releaseDateFn).toHaveBeenCalledOnce();
    });
    demuxer.appendChunk(buffer);
});

test.concurrent('test 3', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test3.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    const Tags: { Name: string; String: string }[] = new XMLParser().parse(
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test3-tag.xml`))
    )?.Tags?.Tag?.Simple;

    expectTypeOf(Tags).toBeArray();

    demuxer.on(MatroskaElements.SimpleTag, (tag) => {
        Tags.forEach((sourceTag) => {
            if (sourceTag.Name == tag.TagName) {
                expect(sourceTag.String.toString()).toBe(tag.TagString?.toString());
            }
        });
    });

    const releaseDateFn = vi.fn((date: Date) => {
        expect(date.getFullYear()).toBe(2010);
    });
    demuxer.on(MatroskaElements.DateUTC, releaseDateFn);

    demuxer.on('chunkDone', () => {
        expect(releaseDateFn).toHaveBeenCalledOnce();
    });
    demuxer.appendChunk(buffer);
});

// Unknown element size is not implemented
test.concurrent('test 4', { skip: true }, async () => {
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

test.concurrent('test 5', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test5.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    const Tags: { Name: string; String: string }[] = new XMLParser().parse(
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test5-tag.xml`))
    )?.Tags?.Tag?.Simple;

    expectTypeOf(Tags).toBeArray();

    demuxer.on(MatroskaElements.SimpleTag, (tag) => {
        Tags.forEach((sourceTag) => {
            if (sourceTag.Name == tag.TagName) {
                expect(sourceTag.String.toString()).toBe(tag.TagString?.toString());
            }
        });
    });

    const releaseDateFn = vi.fn((date: Date) => {
        expect(date.getFullYear()).toBe(2010);
    });

    let audioTracks = 0;
    const subTracks: (string | undefined)[] = [];
    const audioTrackFn = vi.fn((track: Elements.TrackEntry) => {
        if (track.TrackType == Elements.TrackType.Audio) {
            audioTracks++;
        }
        if (track.TrackType == Elements.TrackType.Subtitle) {
            subTracks.push(track.Language);
        }
    });

    demuxer.on(MatroskaElements.DateUTC, releaseDateFn);
    demuxer.on(MatroskaElements.TrackEntry, audioTrackFn);

    demuxer.on('chunkDone', () => {
        expect(releaseDateFn).toHaveBeenCalledOnce();
        expect(audioTrackFn).toHaveBeenCalledTimes(11);

        expect(audioTracks).toBe(2);
        [undefined, 'hun', 'ger', 'fre', 'spa', 'ita', 'jpn', 'und'].forEach((lang) => {
            expect(subTracks).toContain(lang);
        });
        expect(subTracks).toHaveLength(8);
    });
    demuxer.appendChunk(buffer);
});

test.concurrent('test 6', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test5.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    const Tags: { Name: string; String: string }[] = new XMLParser().parse(
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test5-tag.xml`))
    )?.Tags?.Tag?.Simple;

    expectTypeOf(Tags).toBeArray();

    demuxer.on(MatroskaElements.SimpleTag, (tag) => {
        Tags.forEach((sourceTag) => {
            if (sourceTag.Name == tag.TagName) {
                expect(sourceTag.String.toString()).toBe(tag.TagString?.toString());
            }
        });
    });

    const releaseDateFn = vi.fn((date: Date) => {
        expect(date.getFullYear()).toBe(2010);
    });
    demuxer.on(MatroskaElements.DateUTC, releaseDateFn);

    demuxer.on('chunkDone', () => {
        expect(releaseDateFn).toHaveBeenCalledOnce();
    });
    demuxer.appendChunk(buffer);
});

test.concurrent('test 7', async () => {
    const buffer = (
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test7.mkv`))
    ).buffer;
    const demuxer = new WebmReader();

    const Tags: { Name: string; String: string }[] = new XMLParser().parse(
        await readFile(path.join(__dirname, '..', `/matroska-test-files/test_files/test7-tag.xml`))
    )?.Tags?.Tag?.Simple;

    expectTypeOf(Tags).toBeArray();

    demuxer.on(MatroskaElements.SimpleTag, (tag) => {
        Tags.forEach((sourceTag) => {
            if (sourceTag.Name == tag.TagName) {
                expect(sourceTag.String.toString()).toBe(tag.TagString?.toString());
            }
        });
    });
    demuxer.on(MatroskaElements.FlagInterlaced, () => {
        console.log('Nope');
    });
    demuxer.on('unknownElement', (elem) => {
        console.log('Unknown');
    });

    const releaseDateFn = vi.fn((date: Date) => {
        expect(date.getFullYear()).toBe(2010);
    });
    demuxer.on(MatroskaElements.DateUTC, releaseDateFn);

    demuxer.on('chunkDone', () => {
        expect(releaseDateFn).toHaveBeenCalledOnce();
    });
    demuxer.appendChunk(buffer);
});
