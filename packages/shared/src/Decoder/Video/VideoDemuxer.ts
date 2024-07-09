export class VideoDemuxer {
    private static demuxers: { [mime: string]: (() => Promise<BaseDemuxer | undefined>)[] } = {};

    static RegisterDemuxer(mimeType: string, demuxer: () => Promise<BaseDemuxer | undefined>) {
        this.demuxers[mimeType] ||= [];
        this.demuxers[mimeType].push(demuxer);
    }

    static async GetDemuxer(file: File): Promise<BaseDemuxer | undefined> {
        console.log(file.type);
        if (file.type in this.demuxers) {
            for await (const demuxerProm of this.demuxers[file.type]) {
                try {
                    const demuxer = await demuxerProm();
                    if (demuxer) {
                        return demuxer;
                    }
                } catch (error) {
                    console.error('Error loading demuxer for type ' + file.type, error);
                }
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
    segments: DemuxedVideoSegment[];
}

/**
 * A segment representing a range of video chunks that starts with an keyframe
 */
export interface DemuxedVideoSegment {
    samples: EncodedVideoChunk[];
    /**
     * @unit microseconds
     */
    timestamp: number;
    /**
     * End of this segment including duration of last chunk
     *
     * @unit microseconds
     */
    timestampEnd: number;
}

export interface BaseDemuxer {
    DemuxFile: (file: File) => Promise<DemuxedVideoTrack[] | undefined>;
}

// Load default demuxers
VideoDemuxer.RegisterDemuxer(
    'video/mp4',
    async () => new (await import('./mp4/Mp4Demuxer')).Mp4Demuxer()
);
VideoDemuxer.RegisterDemuxer(
    'video/quicktime',
    async () => new (await import('./mp4/Mp4Demuxer')).Mp4Demuxer()
);
