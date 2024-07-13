import { type BaseDemuxer, type DemuxedVideoTrack } from '../VideoDemuxer';

export class WebmDemuxer implements BaseDemuxer {
    async DemuxFile(file: File): Promise<DemuxedVideoTrack[] | undefined> {
        return [];
    }
}
