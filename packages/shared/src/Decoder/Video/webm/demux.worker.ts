import { BlockFlags } from '@safelight/tswebm/Block';
import { Elements, MatroskaElements } from '@safelight/tswebm/elements';
import { WebmReader } from '@safelight/tswebm/WebmReader';
import { expose } from 'comlink';
import type { DemuxedChunk } from '../VideoDemuxer';
import type { WorkerOutput } from './WebmDemuxer';

export async function demux(source: File, callback: (event: WorkerOutput) => void) {
    const demuxer = new WebmReader({});

    const reader = source.stream().getReader();

    // Keep a map of tracks to refer back when needing to send more info
    const tracks = new Map<number, Elements.TrackEntry>();
    // To know when a track has complete codec information
    const completeTracks = new Set<number>();

    demuxer.on(MatroskaElements.TrackEntry, (track) => {
        if (track.TrackType == Elements.TrackType.Video) {
            tracks.set(track.TrackNumber, track);
            console.log('Video', track.CodecID);
        } else if (track.TrackType == Elements.TrackType.Audio && track.Audio) {
            tracks.set(track.TrackNumber, track);
            console.log('Audio', track.CodecID);
        }
    });

    let blockBuffer: DemuxedChunk[] = [];

    demuxer.on('block', (block) => {
        if (!tracks.has(block.TrackNumber)) return;

        const track = tracks.get(block.TrackNumber)!;

        const isTrackComplete = completeTracks.has(track.TrackNumber);

        if (!isTrackComplete) {
            if (track.TrackType == Elements.TrackType.Video) {
                const dv = new DataView(block.data);
                switch (track.CodecID) {
                    case 'V_AV1':
                        break;
                    case 'V_VP9': {
                        const headerInfo = decodeVP9Header(dv);

                        callback({
                            decoderConfig: {
                                // It doesn't seem like neither Firefox nor Chromium care about the level. So I just rolled a dice and set it to 1.0
                                codec: `vp09.${headerInfo.profile.toString().padStart(2, '0')}.10.${headerInfo.bitDepth.toString().padStart(2, '0')}`,
                                codedWidth: track.Video!.PixelWidth,
                                codedHeight: track.Video!.PixelHeight
                            },
                            trackIndex: block.TrackNumber,
                            type: 'video'
                        });
                        completeTracks.add(track.TrackNumber);
                        break;
                    }
                    case 'V_MPEGH/ISO/HEVC':
                        break;
                    case 'V_MPEGH/ISO/AVC':
                        break;

                    default:
                        break;
                }
            } else if (track.TrackType == Elements.TrackType.Audio) {
                let codecString: string | undefined;
                if (track.CodecID.startsWith('A_AAC/')) {
                    codecString = 'aac';
                } else {
                    switch (track.CodecID) {
                        case 'A_MPEG/L3':
                            codecString = 'mp3';
                            break;
                        case 'A_OPUS':
                            codecString = 'opus';
                            break;
                        case 'A_VORBIS':
                            codecString = 'vorbis';
                            break;
                        case 'A_ALAC':
                            codecString = 'alac';
                            break;
                        case 'A_FLAC':
                            codecString = 'flac';
                            break;

                        default:
                            break;
                    }
                }

                if (codecString) {
                    callback({
                        decoderConfig: {
                            codec: codecString,
                            numberOfChannels: track.Audio!.Channels,
                            sampleRate: track.Audio!.SamplingFrequency,
                            description: track.CodecPrivate
                        },
                        trackIndex: block.TrackNumber,
                        type: 'audio'
                    });
                    completeTracks.add(track.TrackNumber);
                }
            }
        }

        // Send block
        let curIndex = 0;
        if (track.TrackType == Elements.TrackType.Video) {
            curIndex = blockBuffer.push({
                chunk: new EncodedVideoChunk({
                    data: block.totalBuffer,
                    timestamp: block.TimeStamp,
                    type: block.hasFlag(BlockFlags.Keyframe) ? 'key' : 'delta'
                }),
                trackIndex: block.TrackNumber,
                type: 'chunk'
            });
        } else if (track.TrackType == Elements.TrackType.Audio) {
            curIndex = blockBuffer.push({
                chunk: new EncodedAudioChunk({
                    data: block.totalBuffer,
                    timestamp: block.TimeStamp,
                    type: block.hasFlag(BlockFlags.Keyframe) ? 'key' : 'delta'
                }),
                trackIndex: block.TrackNumber,
                type: 'chunk'
            });
        }
        if (curIndex >= 1000) {
            callback(blockBuffer);
            blockBuffer = [];
        }
    });

    while (true) {
        const chunk = await reader.read();
        if (chunk.done || !chunk.value) {
            break;
        }
        try {
            demuxer.appendChunk(chunk.value.buffer);
        } catch (error) {
            console.error(error);
        }
    }

    if (blockBuffer.length > 0) {
        callback(blockBuffer);
        blockBuffer = [];
    }

    demuxer.flush();

    callback({
        type: 'done'
    });
}

function decodeVP9Header(data: DataView) {
    const vpx_rb_read_bit = (buffer: DataView, offset = 0) => {
        const p = offset >> 3;
        const q = 7 - (offset & 0x7);
        if (p < buffer.byteLength) {
            const bit = (buffer.getUint8(p) >> q) & 1;
            return bit;
        } else {
            throw new Error('No data');
        }
    };

    const read_profile = (buffer: DataView, offset = 2) => {
        let profile = vpx_rb_read_bit(buffer, offset);
        profile |= vpx_rb_read_bit(buffer, offset + 1) << 1;

        if (profile > 2) {
            profile += vpx_rb_read_bit(buffer, offset + 2);
        }
        return profile;
    };

    const read_bit_depth_flag = (buffer: DataView, profile: number, offset = 2) => {
        if (profile < 2) {
            return 8;
        }
        // Skipping version and high
        offset += 2;
        // Skipping RESERVED_ZERO
        if (profile > 2) offset += 1;
        // Check `show_existing_frame`, return if 1
        const showExistingFrame = vpx_rb_read_bit(buffer, offset);
        if (showExistingFrame > 0) {
            throw new Error(
                'Frame was a reference to another frame, could not read bit-depth flag'
            );
        }
        // After `show_existing_frame`
        offset += 1;

        const frameType = vpx_rb_read_bit(buffer, offset);
        // Check if keyframe
        if (frameType == 0) {
            // Skip `frame_type`, `show_frame` and `error_resilient_mode`
            offset += 3;
            // Skip `SYNC_CODE`
            offset += 24;

            return vpx_rb_read_bit(buffer, offset) ? 12 : 10;
        } else {
            throw new Error('Frame is not a keyframe, could not read bit-depth flag.');
        }
    };

    const profile = read_profile(data, 2);
    const bitDepth = read_bit_depth_flag(data, profile);

    return {
        profile,
        bitDepth
    };
}

function decodeAV1Header(data: DataView) {
    const firstByte = data.getInt8(0);
    const forbiddenBit = (firstByte >> 7) & 0x1;
    if (forbiddenBit !== 0) {
        throw new Error('Data block does not have a valid AV1 OBU header');
    }
    // Idk man
    const type = (firstByte >> 7) & 0x1;
}

expose({ demux });
