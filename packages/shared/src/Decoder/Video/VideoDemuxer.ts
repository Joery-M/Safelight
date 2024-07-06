export class VideoDemuxer {
    private static demuxers: BaseDemuxer[] = [];

    static RegisterDemuxer(demuxer: BaseDemuxer) {
        this.demuxers.push(demuxer);
    }

    static async GetDemuxer(file: File): Promise<BaseDemuxer | undefined> {
        for await (const demuxer of this.demuxers) {
            const res = await demuxer.TestFile(file);

            // Just get first demuxer that matches
            // This might need to be reworked in the future
            if (res === true) {
                return demuxer;
            }
        }
    }

    private demuxer: BaseDemuxer | undefined = undefined;
    private file?: File;

    async loadFile(file: File) {
        this.demuxer = await VideoDemuxer.GetDemuxer(file);
        this.file = file;
        return this.demuxer !== undefined;
    }

    async demux(): Promise<DemuxedVideoTrack[] | undefined> {
        if (!this.demuxer || !this.file) {
            return;
        }

        return this.demuxer.DemuxFile(this.file);
    }
}

// Possible to add more info here if needed, e.g. color space, frame duration
export interface DemuxedVideoTrack {
    id: number;
    width: number;
    height: number;
    codec: string;
    sampleCount: number;
    description?: AllowSharedBufferSource;
    chunks: EncodedVideoChunk[][];
}

export interface BaseDemuxer {
    /**
     * Test whether this file matches this demuxer.
     */
    TestFile: (file: File) => Promise<boolean>;

    DemuxFile: (file: File) => Promise<DemuxedVideoTrack[] | undefined>;
}

import('./mp4/Mp4Demuxer');
