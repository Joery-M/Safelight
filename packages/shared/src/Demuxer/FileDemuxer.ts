import MimeMatcher from 'mime-matcher';
import { Observable } from 'rxjs';
import type { MediaFileAudioTrack, MediaFileVideoTrack } from '../Media/ChunkedMediaFile';

export class FileDemuxer {
    private static demuxers = new Map<string, (() => Promise<BaseDemuxer | undefined>)[]>();

    static registerDemuxer(mimeType: string, demuxer: () => Promise<BaseDemuxer | undefined>) {
        const existingArr = this.demuxers.get(mimeType) ?? [];
        this.demuxers.set(mimeType, [...existingArr, demuxer]);
    }

    static async getDemuxer(file: File): Promise<BaseDemuxer | undefined> {
        for (const demuxerType of this.demuxers.keys()) {
            const matcher = new MimeMatcher(demuxerType);
            if (matcher.match(file.type)) {
                const possibleDemuxers = this.demuxers.get(demuxerType) ?? [];
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
    }

    private demuxer: BaseDemuxer | undefined = undefined;
    private file?: File;

    async loadFile(file: File) {
        this.demuxer = await FileDemuxer.getDemuxer(file);
        this.file = file;
        return this.demuxer !== undefined;
    }

    demux() {
        if (!this.demuxer || !this.file) {
            return;
        }
        return this.demuxer.demuxFile(this.file);
    }
}

export type DemuxerOutput = MediaFileAudioTrack | MediaFileVideoTrack | DemuxedChunkArray;

export interface DemuxedChunkArray {
    type: 'chunks';
    chunks: DemuxedChunk[];
}

export interface DemuxedChunk<ChunkType = EncodedAudioChunkInit | EncodedVideoChunkInit> {
    type: 'chunk';
    trackIndex: number;
    chunk: ChunkType;
}

export interface BaseDemuxer {
    demuxFile: (file: File) => Observable<DemuxerOutput>;
}

// Load default demuxers
FileDemuxer.registerDemuxer(
    'video/mp4',
    async () => new (await import('./mp4/Mp4Demuxer')).Mp4Demuxer()
);
FileDemuxer.registerDemuxer(
    'video/quicktime',
    async () => new (await import('./mp4/Mp4Demuxer')).Mp4Demuxer()
);
FileDemuxer.registerDemuxer(
    'video/x-matroska',
    async () => new (await import('./webm/WebmDemuxer')).WebmDemuxer()
);
FileDemuxer.registerDemuxer(
    'video/webm',
    async () => new (await import('./webm/WebmDemuxer')).WebmDemuxer()
);
