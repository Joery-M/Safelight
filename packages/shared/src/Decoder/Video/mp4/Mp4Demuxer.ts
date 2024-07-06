import * as MP4Box from 'mp4box';
import { type MP4ArrayBuffer } from 'mp4box';
import { VideoDemuxer, type BaseDemuxer, type DemuxedVideoTrack } from '../VideoDemuxer';

class Mp4Demuxer implements BaseDemuxer {
    TestFile(sourceFile: File): Promise<boolean> {
        const file = MP4Box.createFile();
        const reader = sourceFile.stream().getReader();

        return new Promise<boolean>((resolve) => {
            let offset = 0;

            let finished = false;

            const readChunk = (stream: ReadableStreamReadResult<Uint8Array>) => {
                if (stream.value) {
                    const buffer = stream.value.buffer as unknown as MP4ArrayBuffer;
                    buffer.fileStart = offset;

                    offset += buffer.byteLength;

                    file.appendBuffer(buffer);
                }
                if (!stream.done) {
                    reader
                        .read()
                        .then(readChunk)
                        .catch((err) => {
                            console.error('Error loading chunk', err);
                            resolve(false);
                        });
                } else {
                    file.flush();
                    console.log('Done');
                    if (!finished) {
                        resolve(false);
                    }
                }
            };
            reader
                .read()
                .then(readChunk)
                .catch((err) => {
                    console.error('Error loading chunk', err);
                    resolve(false);
                });

            file.onMoovStart = () => {
                console.log('moov');
            };
            file.onReady = (info) => {
                console.log(info);
                resolve(true);
                finished = true;
            };
            file.onError = (e) => {
                console.error(e);
                if (!finished) {
                    resolve(false);
                }
            };
        }).finally(() => {
            // Cleanup
            file.flush();
            file.stop();
            reader.cancel();
            reader.releaseLock();
        });
    }

    DemuxFile(source: File): Promise<DemuxedVideoTrack[] | undefined> {
        return new Promise((resolve) => {
            const file = MP4Box.createFile();

            const reader = source.stream().getReader();

            const result: DemuxedVideoTrack[] = [];

            file.onError = (e: string) => console.error(e);
            file.onReady = (info: MP4Box.MP4Info) => {
                result.push(...this.onReady(info, file));

                for (const track of result) {
                    file.setExtractionOptions(track.id, void 0, void 0);
                    file.start();
                }
            };
            file.onMoovStart = () => console.log('Moov Start');

            this.readChunk(reader, file, 0).then(() => {
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

            file.onSamples = (id: number, _user: any, samples: MP4Box.Sample[]) => {
                const keyframes = this.handleVideoSamples(samples);

                trackSampleLengths[id.toString()] ||= 0;
                trackSampleLengths[id.toString()] += samples.length;

                const track = result.find((t) => t.id == id);
                if (track) {
                    track.chunks.push(...keyframes);
                }

                checkDone();
            };
        });
    }

    /**
     * Use an existing file reader to read a chunk.
     *
     * Is recursively called to process the whole file
     */
    private async readChunk(
        reader: ReadableStreamDefaultReader<Uint8Array>,
        file: MP4Box.MP4File,
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
            await this.readChunk(reader, file, offset);
        }
    }

    private onReady(info: MP4Box.MP4Info, file: MP4Box.MP4File) {
        const trackInfo: DemuxedVideoTrack[] = [];
        for (const track of info.videoTracks) {
            if (!track) continue;

            let avccBox: any;
            for (const trak of file.moov.traks) {
                console.log(trak);
                if (trak.mdia.minf.stbl.stsd.entries[0].avcC) {
                    avccBox = trak.mdia.minf.stbl.stsd.entries[0].avcC;
                    break;
                }
            }

            // const frameDuration = track.samples_duration / track.nb_samples;
            // const fps = Math.round(track.timescale / frameDuration);

            trackInfo.push({
                codec: track.codec,
                height: track.video.height,
                width: track.video.width,
                id: track.id,
                sampleCount: track.nb_samples,
                description: this.getExtradata(avccBox),
                chunks: []
            });
        }
        return trackInfo;
    }

    private handleVideoSamples(samples: MP4Box.Sample[]) {
        const keyFrames: EncodedVideoChunk[][] = [];
        let keyFrameChunks: EncodedVideoChunk[] | null = null;

        for (const sample of samples) {
            const type = sample.is_sync ? 'key' : 'delta';

            if (type === 'key') {
                if (keyFrameChunks) {
                    keyFrames.push(keyFrameChunks);
                }
                keyFrameChunks = [];
            }

            const chunk = new EncodedVideoChunk({
                type: type,
                timestamp: sample.cts,
                duration: sample.duration,
                data: sample.data
            });

            keyFrameChunks?.push(chunk);
        }

        if (keyFrameChunks) {
            keyFrames.push(keyFrameChunks);
        }
        return keyFrames;
    }

    private getExtradata(avccBox: any) {
        let i;
        let size = 7;
        for (i = 0; i < avccBox.SPS.length; i++) {
            // nalu length is encoded as a uint16.
            size += 2 + avccBox.SPS[i].length;
        }
        for (i = 0; i < avccBox.PPS.length; i++) {
            // nalu length is encoded as a uint16.
            size += 2 + avccBox.PPS[i].length;
        }

        const writer = new Writer(size);

        writer.writeUint8(avccBox.configurationVersion);
        writer.writeUint8(avccBox.AVCProfileIndication);
        writer.writeUint8(avccBox.profile_compatibility);
        writer.writeUint8(avccBox.AVCLevelIndication);
        writer.writeUint8(avccBox.lengthSizeMinusOne + (63 << 2));

        writer.writeUint8(avccBox.nb_SPS_nalus + (7 << 5));
        for (i = 0; i < avccBox.SPS.length; i++) {
            writer.writeUint16(avccBox.SPS[i].length);
            writer.writeUint8Array(avccBox.SPS[i].nalu);
        }

        writer.writeUint8(avccBox.nb_PPS_nalus);
        for (i = 0; i < avccBox.PPS.length; i++) {
            writer.writeUint16(avccBox.PPS[i].length);
            writer.writeUint8Array(avccBox.PPS[i].nalu);
        }

        return writer.getData();
    }
}

// Only possible because this file is dynamically imported after VideoDemuxer is defined
VideoDemuxer.RegisterDemuxer(new Mp4Demuxer());

// Taken from https://codesandbox.io/p/sandbox/director-mz1n8t?file=%2Fsrc%2Fengine%2Fdemuxer%2FMP4Demuxer.ts%3A157%2C1-193%2C2
class Writer {
    data: Uint8Array;
    idx: number;
    size: number;

    constructor(size: number) {
        this.data = new Uint8Array(size);
        this.idx = 0;
        this.size = size;
    }

    getData() {
        if (this.idx != this.size) throw 'Mismatch between size reserved and sized used';

        return this.data.slice(0, this.idx);
    }

    writeUint8(value: number) {
        this.data.set([value], this.idx);
        this.idx++;
    }

    writeUint16(value: number) {
        // TODO: find a more elegant solution to endianess.
        const arr = new Uint16Array(1);
        arr[0] = value;
        const buffer = new Uint8Array(arr.buffer);
        this.data.set([buffer[1], buffer[0]], this.idx);
        this.idx += 2;
    }

    writeUint8Array(value: Uint8Array) {
        this.data.set(value, this.idx);
        this.idx += value.length;
    }
}
