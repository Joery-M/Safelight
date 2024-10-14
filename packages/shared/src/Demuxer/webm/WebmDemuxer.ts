import { proxy, releaseProxy, wrap } from 'comlink';
import { Observable } from 'rxjs';
import { type BaseDemuxer, type DemuxerOutput } from '../FileDemuxer';
import DemuxWorker from './demux.worker?worker';

export class WebmDemuxer implements BaseDemuxer {
    demuxFile(source: File) {
        const worker = wrap<typeof import('./demux.worker')>(new DemuxWorker());

        return new Observable<DemuxerOutput>((subscriber) => {
            worker.demux(
                source,
                proxy((event) => {
                    if (event.type == 'done') {
                        subscriber.complete();
                        worker[releaseProxy]();
                    } else {
                        subscriber.next(event);
                    }
                })
            );
        });
    }
}

export type WorkerOutput = DemuxerOutput | { type: 'done' };
