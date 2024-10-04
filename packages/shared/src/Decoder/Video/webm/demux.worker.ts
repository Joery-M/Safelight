import { Elements, MatroskaElements } from '@safelight/tswebm/elements';
import { WebmReader } from '@safelight/tswebm/WebmReader';
import { expose } from 'comlink';
import type { WorkerOutput } from './WebmDemuxer';

export async function demux(source: File, callback: (event: WorkerOutput) => void) {
    const demuxer = new WebmReader({});

    const reader = source.stream().getReader();

    const tracksHaveSentData = new Map<number, boolean>();

    demuxer.on(MatroskaElements.TrackEntry, (track) => {
        if (track.TrackType == Elements.TrackType.Video) {
            if (track.CodecID) {
            }
            tracksHaveSentData.set(track.TrackNumber, true);
            callback({
                type: 'video',
                trackIndex: track.TrackNumber,
                decoderConfig: {
                    codec: '' // TODO: Support parsing different codecs
                }
            } as WorkerOutput);
        } else if (track.TrackType == Elements.TrackType.Audio && track.Audio) {
            callback({
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

    callback({
        type: 'done'
    });
}

function getVideoCodecString() {}

expose({ demux });
