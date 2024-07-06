import { useWebWorkerFn } from '@vueuse/core';
import { VideoDemuxer, type BaseDemuxer, type DemuxedVideoTrack } from '../VideoDemuxer';

class Mp4Demuxer implements BaseDemuxer {
    async TestFile(sourceFile: File): Promise<boolean> {
        const processFn = (await import('./workers/filetest.worker')).default;

        const worker = useWebWorkerFn(processFn, {
            dependencies: [new URL('mp4box/dist/mp4box.all.min.js', import.meta.url).href],
            timeout: 10000
        });

        return Promise.resolve(worker.workerFn(sourceFile));
    }

    async DemuxFile(source: File): Promise<DemuxedVideoTrack[] | undefined> {
        const processFn = (await import('./workers/demux.worker')).default;
        const worker = useWebWorkerFn(processFn, {
            dependencies: [new URL('mp4box/dist/mp4box.all.min.js', import.meta.url).href]
        });

        return Promise.resolve(worker.workerFn(source));
    }
}

// Only possible because this file is dynamically imported after VideoDemuxer is defined
VideoDemuxer.RegisterDemuxer(new Mp4Demuxer());
