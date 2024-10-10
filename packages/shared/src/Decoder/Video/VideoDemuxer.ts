import { Observable } from 'rxjs';

export class VideoDemuxer {
    private static demuxers = new Map<string, (() => Promise<BaseDemuxer | undefined>)[]>();

    static RegisterDemuxer(mimeType: string, demuxer: () => Promise<BaseDemuxer | undefined>) {
        const existingArr = this.demuxers.get(mimeType) ?? [];
        this.demuxers.set(mimeType, [...existingArr, demuxer]);
    }

    static async GetDemuxer(file: File): Promise<BaseDemuxer | undefined> {
        if (this.demuxers.has(file.type)) {
            const possibleDemuxers = this.demuxers.get(file.type) ?? [];
            for await (const demuxerProm of possibleDemuxers) {
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

    demux() {
        if (!this.demuxer || !this.file) {
            return;
        }
        return this.demuxer.DemuxFile(this.file);
    }
}

export type DemuxerOutput = DemuxedVideoTrack | DemuxedAudioTrack | DemuxedChunkArray;

export interface DemuxedVideoTrack {
    type: 'video';
    trackIndex: number;
    decoderConfig: VideoDecoderConfig;
}
export interface DemuxedAudioTrack {
    type: 'audio';
    trackIndex: number;
    decoderConfig: AudioDecoderConfig;
}

export interface DemuxedChunkArray {
    type: 'chunks';
    chunks: DemuxedChunk[];
}

export interface DemuxedChunk<ChunkType = EncodedAudioChunk | EncodedVideoChunk> {
    type: 'chunk';
    trackIndex: number;
    chunk: ChunkType;
}

export interface BaseDemuxer {
    DemuxFile: (file: File) => Observable<DemuxerOutput>;
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
VideoDemuxer.RegisterDemuxer(
    'video/x-matroska',
    async () => new (await import('./webm/WebmDemuxer')).WebmDemuxer()
);
VideoDemuxer.RegisterDemuxer(
    'video/webm',
    async () => new (await import('./webm/WebmDemuxer')).WebmDemuxer()
);
