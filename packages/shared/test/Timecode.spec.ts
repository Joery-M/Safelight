import { DateTime } from 'luxon';
import { expect, suite, test } from 'vitest';
import Timecode from '../src/Timecode';

test('From JS Date', () => {
    const date = new Date(1000);

    const res = Timecode.fromDate(date);

    expect(res).toBe(1000);
});

test('From Luxon', () => {
    const date = DateTime.fromMillis(1000);

    const res = Timecode.fromDate(date);

    expect(res).toBe(1000);
});

test('From Frames 1', () => {
    const fps = 60;
    const frameNum = 60;
    const res = Timecode.fromFrames(frameNum, fps);

    expect(res).toBe(1000);
});

test('From Frames 2', () => {
    const fps = 60;
    const frameNum = 30;
    const res = Timecode.fromFrames(frameNum, fps);

    expect(res).toBe(500);
});

suite('Timecode Formatted', (test) => {
    test('From formatted 1', () => {
        const formatted = '00:00:01.000';
        const res = Timecode.fromFormattedTimecode(formatted);

        expect(res).toBe(1000);
    });
    test('From formatted 2', () => {
        const formatted = '00:01:00.000';
        const res = Timecode.fromFormattedTimecode(formatted);

        expect(res).toBe(60000);
    });
    test('From formatted 3', () => {
        const formatted = '02:13:52.200';
        const res = Timecode.fromFormattedTimecode(formatted);

        expect(res).toBe(8032200);
    });

    test('To formatted 2', () => {
        const ms = 1000;
        const res = Timecode.toFormattedTimecode(ms);

        expect(res).toBe('00:00:01.000');
    });
    test('To formatted 2', () => {
        const ms = 8032200;
        const res = Timecode.toFormattedTimecode(ms);

        expect(res).toBe('02:13:52.200');
    });
});
