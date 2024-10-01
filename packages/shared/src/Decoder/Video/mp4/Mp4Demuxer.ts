import { Observable } from 'rxjs';
import { type BaseDemuxer, type DemuxerOutput } from '../VideoDemuxer';
import DemuxWorker from './demux.worker?worker';

export class Mp4Demuxer implements BaseDemuxer {
    DemuxFile(source: File) {
        const worker = new DemuxWorker();

        worker.postMessage({ source });
        return new Observable<DemuxerOutput>((subscriber) => {
            worker.addEventListener('message', (ev: MessageEvent<WorkerOutput>) => {
                if (!Array.isArray(ev.data) && ev.data.type === 'done') {
                    worker.terminate();
                    subscriber.complete();
                } else {
                    subscriber.next(ev.data);
                }
            });

            worker.addEventListener('error', (ev) => {
                console.error(ev);
            });

            subscriber.add(() => {
                worker.terminate();
            });
        });
    }
}

export type WorkerOutput = DemuxerOutput | { type: 'done' };
