import { Elements, MatroskaElements } from '@safelight/tswebm/elements';
import { WebmReader } from '@safelight/tswebm/WebmReader';
import type { WorkerOutput } from './WebmDemuxer';

async function demux(source: File) {
    const demuxer = new WebmReader({});

    const reader = source.stream().getReader();

    demuxer.on(MatroskaElements.TrackEntry, (track) => {
        if (track.TrackType == Elements.TrackType.Video) {
            if (track.CodecID) {
            }
            self.postMessage({
                type: 'video',
                trackIndex: track.TrackNumber,
                decoderConfig: {
                    codec: '' // TODO: Support parsing different codecs
                }
            } as WorkerOutput);
        } else if (track.TrackType == Elements.TrackType.Audio && track.Audio) {
            self.postMessage({
                type: 'audio',
                trackIndex: track.TrackNumber,
                decoderConfig: {
                    // Should be enough for WebCodecs
                    codec: track.CodecID.slice(2).toLowerCase(),
                    numberOfChannels: track.Audio.Channels,
                    sampleRate: track.Audio.SamplingFrequency,
                    description: track.CodecPrivate
                }
            } as WorkerOutput);
        }
    });

    while (true) {
        const chunk = await reader.read();
        if (chunk.done || !chunk.value) {
            break;
        }
        demuxer.appendChunk(chunk.value);
    }
}

function getVideoCodecString() {}

self.addEventListener('message', (ev) => {
    if ('source' in ev.data) {
        demux(ev.data.source as File)
            .then(() => {
                self.postMessage({ type: 'done' });
            })
            .catch((error) => {
                self.postMessage({ type: 'error', error });
            });
    }
});
