import '../../../../../worker-types/mp4box.d.ts';

import type { DemuxedVideoSegment, DemuxedVideoTrack } from '../../VideoDemuxer';

export default function (source: File) {
    return new Promise<DemuxedVideoTrack[] | undefined>((resolve) => {
        const file = MP4Box.createFile();

        const reader = source.stream().getReader();

        const result: DemuxedVideoTrack[] = [];

        file.onError = (e: string) => console.error(e);
        file.onReady = (info: MP4Info) => {
            result.push(...onReady(info, file));

            for (const track of result) {
                file.setExtractionOptions(track.id, void 0, void 0);
                file.start();
            }
        };
        file.onMoovStart = () => console.log('Moov Start');

        readChunk(reader, file, 0).then(() => {
            file.flush();
        });

        /**
         * Number of samples found per track
         *
         * Used to figure out when track is done demuxing
         */
        const trackSampleLengths: { [track: string]: number } = {};

        function checkDone() {
            for (const trackId in trackSampleLengths) {
                if (Object.prototype.hasOwnProperty.call(trackSampleLengths, trackId)) {
                    const samples = trackSampleLengths[trackId];

                    const track = result.find((t) => t.id.toString() == trackId.toString());

                    if (track && track.sampleCount == samples) {
                        resolve(result);
                    }
                }
            }
        }

        file.onSamples = (id: number, _user: any, samples: Sample[]) => {
            const keyframes = handleVideoSamples(samples);

            trackSampleLengths[id.toString()] ||= 0;
            trackSampleLengths[id.toString()] += samples.length;

            const track = result.find((t) => t.id == id);
            if (track) {
                track.segments.push(...keyframes);
            }

            checkDone();
        };
    });

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
        const trackInfo: DemuxedVideoTrack[] = [];
        for (const track of info.videoTracks) {
            if (!track) continue;

            const box = file.getTrackById(track.id).mdia.minf.stbl.stsd.entries;

            // const frameDuration = track.samples_duration / track.nb_samples;
            // const fps = Math.round(track.timescale / frameDuration);

            trackInfo.push({
                codec: track.codec,
                height: track.video.height,
                width: track.video.width,
                id: track.id,
                sampleCount: track.nb_samples,
                description: getExtradata(box),
                segments: []
            });
        }
        return trackInfo;
    }

    function handleVideoSamples(samples: Sample[]) {
        const keyFrames: DemuxedVideoSegment[] = [];
        let keyFrameChunks: EncodedVideoChunk[] | null = null;

        for (const sample of samples) {
            const type = sample.is_sync ? 'key' : 'delta';

            if (type === 'key') {
                if (keyFrameChunks) {
                    keyFrames.push({
                        samples: keyFrameChunks,
                        timestamp: keyFrameChunks.at(0)!.timestamp,
                        timestampEnd: (1e6 * sample.cts) / sample.timescale
                    });
                }
                keyFrameChunks = [];
            }

            const chunk = new EncodedVideoChunk({
                type: type,
                timestamp: (1e6 * sample.cts) / sample.timescale,
                duration: (1e6 * sample.duration) / sample.timescale,
                data: sample.data
            });

            keyFrameChunks?.push(chunk);
        }

        if (keyFrameChunks) {
            keyFrames.push({
                samples: keyFrameChunks,
                timestamp: keyFrameChunks.at(0)!.timestamp,
                timestampEnd: keyFrameChunks.at(-1)!.timestamp + keyFrameChunks.at(-1)!.duration!
            });
        }
        return keyFrames;
    }

    function getExtradata(entries: any) {
        for (const entry of entries) {
            const box: BoxParser.Box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
            if (box) {
                console.log(box);
                const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
                box.write(stream);
                return new Uint8Array(stream.buffer, 8); // Remove the box header.
            }
        }
    }
}
