import { proxy, releaseProxy, wrap } from 'comlink';
import { Observable } from 'rxjs';
import { type BaseDemuxer, type DemuxerOutput } from '../VideoDemuxer';
import DemuxWorker from './demux.worker?worker';

export class Mp4Demuxer implements BaseDemuxer {
    DemuxFile(source: File) {
        const worker = wrap<typeof import('./demux.worker')>(new DemuxWorker());

        return new Observable<DemuxerOutput>((subscriber) => {
            worker.demux(
                source,
                proxy((event) => {
                    console.log(event);
                    if (Array.isArray(event) || event.type !== 'done') {
                        subscriber.next(event);
                    } else if (event.type == 'done') {
                        subscriber.complete();
                        worker[releaseProxy]();
                    }
                })
            );
        });
    }
}

export type WorkerOutput = DemuxerOutput | { type: 'done' };
