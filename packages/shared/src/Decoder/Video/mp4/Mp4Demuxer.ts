import { type BaseDemuxer, type DemuxedVideoTrack } from '../VideoDemuxer';
import DemuxWorker from './demux.worker?worker';

export class Mp4Demuxer implements BaseDemuxer {
    DemuxFile(source: File): Promise<DemuxedVideoTrack[] | undefined> {
        const worker = new DemuxWorker();

        worker.postMessage({ source });
        return new Promise((resolve, reject) => {
            worker.addEventListener('message', (ev) => {
                if (ev.data.type == 'success') {
                    resolve(ev.data.result);
                } else if (ev.data.type == 'error') {
                    reject(ev.data.error);
                }
            });
        });
    }
}
