import {
    createFile,
    DataStream,
    Endianness,
    ISOFile,
    MP4BoxBuffer,
    SampleEntry,
    type Track
} from 'mp4box';

import * as Comlink from 'comlink';
import type { MediaFileAudioTrack, MediaFileVideoTrack } from '../../Media/ChunkedMediaFile';
import type { DemuxedChunk } from '../FileDemuxer';
import type { WorkerOutput } from './Mp4Demuxer';

export function demux(source: File, callback: (event: WorkerOutput) => any) {
    const file = createFile(true);

    file.onError = (e) => {
        console.error(e);
    };
    file.onReady = (info) => {
        for (const track of info.tracks) {
            if (track.type === 'video') {
                callback(convertVideoTrack(track, file));
            } else if (track.type === 'audio') {
                callback(convertAudioTrack(track));
            } else {
                console.error('Could not parse track of type', track.type);
                continue;
            }
            file.setExtractionOptions(track.id);
        }
        file.start();
        callback({ type: 'done' });
    };

    file.onSamples = (_id, _user, samples) => {
        const chunks: DemuxedChunk[] = samples
            .map((sample) => {
                if (!sample.data) return null;
                const type = sample.is_sync ? 'key' : 'delta';

                const chunk: EncodedVideoChunkInit | EncodedAudioChunkInit = {
                    type: type,
                    timestamp: (1e6 * sample.cts) / sample.timescale,
                    duration: (1e6 * sample.duration) / sample.timescale,
                    data: sample.data
                };
                return {
                    type: 'chunk',
                    trackIndex: sample.track_id,
                    chunk
                } satisfies DemuxedChunk;
            })
            .filter((v) => v !== null);
        callback({ type: 'chunks', chunks });
        return;
    };

    readChunk(source.stream().getReader(), file).then(() => {
        file.flush();
        file.getInfo();
    });
}

async function readChunk(reader: ReadableStreamDefaultReader<Uint8Array>, file: ISOFile) {
    let offset = 0;
    while (true) {
        const chunk = await reader.read();
        if (chunk.value) {
            const buffer = MP4BoxBuffer.fromArrayBuffer(chunk.value.buffer, offset);

            offset += buffer.byteLength;

            file.appendBuffer(buffer, chunk.done);
        }
        if (chunk.done) {
            file.appendBuffer(new MP4BoxBuffer(0), true);
            file.flush();
            break;
        }
    }
}

/**
 * Convert mp4box video track into our `MediaFileVideoTrack`
 */
function convertVideoTrack(track: Track, file: ISOFile): MediaFileVideoTrack {
    const box = file.getTrackById(track.id).mdia.minf.stbl.stsd.entries;

    return {
        type: 'video',
        trackIndex: track.id,
        codec: track.codec,
        height: track.track_height,
        width: track.track_width,
        decoderConfig: {
            codec: track.codec,
            codedWidth: track.track_width,
            codedHeight: track.track_height,
            description: getExtraData(box)
        }
    };
}

/**
 * Convert mp4box audio track into our `MediaFileAudioTrack`
 */
function convertAudioTrack(track: Track): MediaFileAudioTrack {
    if (!track.audio)
        throw new Error(
            'Could not convert audio track to MediaFileAudioTrack, missing track.audio'
        );

    return {
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
    };
}

function getExtraData(entries: SampleEntry[]) {
    for (const entry of entries) {
        // It just works, deal with it
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
        if (box) {
            const stream = new DataStream(undefined, 0, Endianness.BIG_ENDIAN);
            box.write(stream);
            return stream.buffer.slice(8); // Remove the box header.
        }
    }
}

Comlink.expose({
    demux
});
