import { Reader } from './dataReader';

const LacingMask = 0b11111001;

/**
 * Block representing a raw section of video
 *
 * @notes https://www.matroska.org/technical/notes.html#block-structure
 */
export class Block {
    private buffer: DataView;
    TrackNumber: number;
    TimeStamp: number;
    Flags: number;

    data: ArrayBuffer;
    constructor(
        public totalBuffer: ArrayBuffer,
        timestampOffset = 0
    ) {
        this.buffer = new DataView(this.totalBuffer);

        const trackVint = Reader.readVInt(0, this.buffer);
        this.TrackNumber = trackVint.rest;
        this.TimeStamp = this.buffer.getInt16(trackVint.size) + timestampOffset;
        this.Flags = this.buffer.getUint8(trackVint.size + 2);

        this.data = totalBuffer.slice(trackVint.size + 3);
    }

    hasFlag(flag: BlockFlags) {
        if (
            flag === BlockFlags.NoLacing ||
            flag === BlockFlags.XiphLacing ||
            flag === BlockFlags.EBMLLacing ||
            flag === BlockFlags.FixedSizeLacing
        ) {
            // We only care about _____XX_
            const lacing = this.Flags ^ LacingMask;
            return (lacing ^ flag) === 0;
        }
        return (this.Flags ^ flag) === 0;
    }
}

//prettier-ignore
export enum BlockFlags {
    Keyframe        = 0b10000000,
    Invisible       = 0b00001000,
    NoLacing        = 0b00000000,
    XiphLacing      = 0b00000010,
    EBMLLacing      = 0b00000110,
    FixedSizeLacing = 0b00000100,
    Discardable     = 0b00000001,
}
