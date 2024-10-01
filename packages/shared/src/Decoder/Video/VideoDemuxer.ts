import { Observable } from 'rxjs';

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

    demux() {
        if (!this.demuxer || !this.file) {
            return;
        }
        return this.demuxer.DemuxFile(this.file);
    }
}

export type DemuxerOutput = DemuxedVideoTrack | DemuxedAudioTrack | DemuxedChunk[];

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
