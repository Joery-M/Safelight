import {
    createFile,
    DataStream,
    type BoxParser,
    type MP4ArrayBuffer,
    type MP4File,
    type MP4Info,
    type Sample
} from 'mp4box';

import * as Comlink from 'comlink';
import type { MediaFileAudioTrack, MediaFileVideoTrack } from '../../Media/ChunkedMediaFile';
import type { DemuxedChunk } from '../FileDemuxer';
import type { WorkerOutput } from './Mp4Demuxer';

export function demux(source: File, callback: (event: WorkerOutput) => any) {
    const file = createFile();

    const reader = source.stream().getReader();

    const result: (MediaFileVideoTrack | MediaFileAudioTrack)[] = [];

    file.onError = (e: string) => {
        console.error(e);
    };
    file.onReady = (info: MP4Info) => {
        result.push(...onReady(info, file));

        for (const track of result) {
            callback(track as WorkerOutput);
            file.setExtractionOptions(track.trackIndex, void 0, void 0);
            file.start();
        }
    };

    readChunk(reader, file, 0).then(() => {
        file.flush();
    });

    /**
     * Its possible for tracks to report the wrong sample count, so this is just a safeguard
     */
    let doneTimeout: ReturnType<typeof setTimeout>;

    file.onSamples = (_id: number, _user: any, samples: Sample[]) => {
        clearTimeout(doneTimeout);
        doneTimeout = setTimeout(() => {
            callback({ type: 'done' });
        }, 500);

        const chunks: DemuxedChunk[] = [];

        for (const sample of samples) {
            const type = sample.is_sync ? 'key' : 'delta';

            const track = result.find((t) => t.trackIndex == sample.track_id);

            if (track?.type == 'video') {
                const chunk: EncodedVideoChunkInit = {
                    type: type,
                    timestamp: (1e6 * sample.cts) / sample.timescale,
                    duration: (1e6 * sample.duration) / sample.timescale,
                    data: sample.data
                };
                chunks.push({
                    type: 'chunk',
                    trackIndex: sample.track_id,
                    chunk
                });
            } else if (track?.type == 'audio') {
                const chunk: EncodedAudioChunkInit = {
                    type: type,
                    timestamp: (1e6 * sample.cts) / sample.timescale,
                    duration: (1e6 * sample.duration) / sample.timescale,
                    data: sample.data
                };
                chunks.push({
                    type: 'chunk',
                    trackIndex: sample.track_id,
                    chunk
                });
            }
        }
        callback({ type: 'chunks', chunks });
        return;
    };
}
/**
 * Use an existing file reader to read a chunk.
 *
 * Is recursively called to process the whole file
 */
async function readChunk(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    file: MP4File,
    offset = 0
) {
    const stream = await reader.read();
    if (stream.value) {
        const buffer = stream.value.buffer as unknown as MP4ArrayBuffer;
        buffer.fileStart = offset;

        offset += buffer.byteLength;

        file.appendBuffer(buffer);
    }
    if (!stream.done) {
        await readChunk(reader, file, offset);
    }
}

function onReady(info: MP4Info, file: MP4File) {
    const vidTrackInfo: MediaFileVideoTrack[] = [];
    const audTrackInfo: MediaFileAudioTrack[] = [];

    for (const track of info.videoTracks) {
        if (!track) continue;

        const box = file.getTrackById(track.id).mdia.minf.stbl.stsd.entries;

        // const frameDuration = track.samples_duration / track.nb_samples;
        // const fps = Math.round(track.timescale / frameDuration);

        vidTrackInfo.push({
            type: 'video',
            trackIndex: track.id,
            codec: track.codec,
            height: track.video.height,
            width: track.video.width,
            decoderConfig: {
                codec: track.codec,
                codedWidth: track.video.width,
                codedHeight: track.video.height,
                description: getExtradata(box)
            }
        });
    }

    for (const track of info.audioTracks) {
        if (!track) continue;

        audTrackInfo.push({
            type: 'audio',
            trackIndex: track.id,
            channels: track.audio.channel_count,
            codec: track.codec,
            sampleRate: track.audio.sample_rate,
            decoderConfig: {
                codec: track.codec,
                numberOfChannels: track.audio.channel_count,
                sampleRate: track.audio.sample_rate
            }
        });
    }
    return [...vidTrackInfo, ...audTrackInfo];
}

function getExtradata(entries: any) {
    for (const entry of entries) {
        const box: BoxParser.Box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
        if (box) {
            const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
            box.write(stream);
            return stream.buffer.slice(8); // Remove the box header.
        }
    }
}

Comlink.expose({
    demux
});
