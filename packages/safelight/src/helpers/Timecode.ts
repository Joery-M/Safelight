import type { ShallowUnwrapRef } from '@vueuse/core';
import { DateTime } from 'luxon';

export default class Timecode {
    public time = 0;

    static from(time: number): TimecodeRef {
        const tc = ref(time);
        return extendRef(tc, {
            formattedTime: computed(() => {
                return DateTime.fromMillis(tc.value).toFormat('HH:mm:ss.SSS');
            })
        });
    }

    static fromTimecode(otherTimecode: Timecode): TimecodeRef {
        return Timecode.from(otherTimecode.time);
    }

    static fromDate(date: Date | DateTime): TimecodeRef {
        return Timecode.from(date instanceof Date ? date.getTime() : date.toMillis());
    }

    static fromFormattedTimecode(timecode: `${number}:${number}:${number}.${number}`) {
        const newTC = Timecode.from(0);
        newTC.formattedTime = timecode;
        return newTC;
    }

    static fromFrames(frame: number, fps: number): TimecodeRef {
        return Timecode.from(frame * (1 / fps));
    }
}

interface ITimecode {
    formattedTime: string;
}
export type TimecodeRef = ShallowUnwrapRef<ITimecode> & globalThis.Ref<number>;
