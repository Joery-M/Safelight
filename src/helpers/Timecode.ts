import { DateTime } from 'luxon';

export default class Timecode {
    public time = 0;

    constructor(time: number) {
        this.time = time;
    }

    static fromTimecode(otherTimecode: Timecode) {
        return new Timecode(otherTimecode.time);
    }
    static fromDate(date: Date | DateTime) {
        return new Timecode(date instanceof Date ? date.getTime() : date.toMillis());
    }
    static fromFormattedTimecode(timecode: `${number}:${number}:${number}.${number}`) {
        const newTC = new Timecode(0);
        newTC.formattedTime = timecode;
        return newTC;
    }
    static fromFrames(frame: number, fps: number) {
        return new Timecode(frame * (1 / fps));
    }

    get formattedTime() {
        return DateTime.fromMillis(this.time).toFormat('HH:mm:ss.SSS');
    }

    set formattedTime(timecode: string) {
        // yea idk
        this.time = DateTime.fromMillis(0)
            .set(DateTime.fromFormatExplain(timecode, 'HH:mm:ss.SSS').result ?? {})
            .toMillis();
    }
}
