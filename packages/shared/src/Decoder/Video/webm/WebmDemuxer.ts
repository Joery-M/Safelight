import { Observable } from 'rxjs';
import { type BaseDemuxer, type DemuxerOutput } from '../VideoDemuxer';
import DemuxWorker from './demux.worker?worker';

export class WebmDemuxer implements BaseDemuxer {
    DemuxFile(source: File) {
        const worker = new DemuxWorker();

        worker.postMessage({ source });

        return new Observable<DemuxerOutput>((subscriber) => {
            subscriber.next();
        });
    }
}

export type WorkerOutput = DemuxerOutput | { type: 'done' };
