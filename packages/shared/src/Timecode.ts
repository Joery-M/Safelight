import type { ShallowUnwrapRef } from '@vueuse/core';
import { type DateTime } from 'luxon';
import { type Ref } from 'vue';

/**
 * Helper class to work with project timecodes.
 */
export default class Timecode {
    static fromDate(date: Date | DateTime) {
        return date instanceof Date ? date.getTime() : date.toMillis();
    }

    static fromFormattedTimecode(
        timecode: `${number}:${number}:${number}.${number}` | (string & {})
    ) {
        const parts = timecode.split(/(?:\.|:)/);
        const hours = parseInt(parts[0]) * 3_600_000;
        const minutes = parseInt(parts[1]) * 60_000;
        const seconds = parseInt(parts[2]) * 1_000;
        const milliseconds = parseInt(parts[3]);

        const newTC = hours + minutes + seconds + milliseconds;
        return newTC;
    }

    static fromFrames(frame: number, fps: number) {
        return frame * (1 / fps) * 1000;
    }

    static toFormattedTimecode(ms: number) {
        const hours = Math.floor(ms / 3_600_000)
            .toString()
            .padStart(2, '0');
        const minutes = (Math.floor(ms / 60_000) % 60).toString().padStart(2, '0');
        const seconds = (Math.floor(ms / 1_000) % 60).toString().padStart(2, '0');
        const milliseconds = Math.round(ms % 1000)
            .toString()
            .padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
}

interface ITimecode {
    formattedTime: string;
}
export type TimecodeRef = ShallowUnwrapRef<ITimecode> & Ref<number>;
