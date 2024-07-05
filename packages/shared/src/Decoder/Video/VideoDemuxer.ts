export class VideoDemuxer {
    constructor(private file: File) {
        file;
    }
}

export interface DemuxedVideoTrack {
    width: number;
    height: number;
    codec: string;
    description?: AllowSharedBufferSource;
}

export interface DemuxedVideoKeyframeSequence {
    chunks: EncodedVideoChunk[];
}
