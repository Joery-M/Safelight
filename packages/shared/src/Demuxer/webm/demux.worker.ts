import { BlockFlags } from '@safelight/tswebm/Block';
import { Elements, MatroskaElements } from '@safelight/tswebm/elements';
import { WebmReader } from '@safelight/tswebm/WebmReader';
import { expose } from 'comlink';
import type { DemuxedChunk } from '../FileDemuxer';
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

            // Set codec string for video codecs that have enough info at the start

            switch (track.CodecID) {
                case 'V_MPEGH/ISO/HEVC': {
                    if (!track.CodecPrivate) break;
                    const view = new DataView(track.CodecPrivate);
                    const codecString = decodeHEVCPrivateData(view);

                    if (!codecString) {
                        return;
                    }

                    callback({
                        decoderConfig: {
                            codec: codecString,
                            codedWidth: track.Video!.DisplayWidth ?? track.Video!.PixelWidth,
                            codedHeight: track.Video!.DisplayHeight ?? track.Video!.PixelHeight
                        },
                        trackIndex: track.TrackNumber,
                        codec: codecString,
                        framerate: track.Video!.FrameRate!,
                        width: track.Video!.PixelWidth,
                        height: track.Video!.PixelHeight,
                        type: 'video'
                    });
                    completeTracks.add(track.TrackNumber);
                    break;
                }
                case 'V_MPEG4/ISO/AVC': {
                    if (!track.CodecPrivate) break;
                    const view = new DataView(track.CodecPrivate);
                    const codecData = decodeAVCPrivateData(view);

                    if (!codecData) break;

                    const codecString = `avc1.${codecData.profile_idc
                        .toString(16)
                        .padStart(2, '0')}${codecData.profile_compat
                        .toString(16)
                        .padStart(2, '0')}${codecData.level_idc.toString(16).padStart(2, '0')}`;

                    callback({
                        decoderConfig: {
                            codec: codecString,
                            codedWidth: track.Video!.DisplayWidth ?? track.Video!.PixelWidth,
                            codedHeight: track.Video!.DisplayHeight ?? track.Video!.PixelHeight
                        },
                        trackIndex: track.TrackNumber,
                        codec: codecString,
                        framerate: track.Video!.FrameRate!,
                        width: track.Video!.PixelWidth,
                        height: track.Video!.PixelHeight,
                        type: 'video'
                    });
                    completeTracks.add(track.TrackNumber);
                    break;
                }

                default:
                    break;
            }
        } else if (track.TrackType == Elements.TrackType.Audio && track.Audio) {
            tracks.set(track.TrackNumber, track);

            // Set codec string for audio

            let codecString: string | undefined;
            if (track.CodecID.startsWith('A_AAC')) {
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
                    trackIndex: track.TrackNumber,
                    codec: codecString,
                    channels: track.Audio!.Channels,
                    sampleRate: track.Audio!.SamplingFrequency,
                    type: 'audio'
                });
                completeTracks.add(track.TrackNumber);
            }
        }
    });

    let blockBuffer: DemuxedChunk[] = [];

    demuxer.on('block', (block) => {
        if (!tracks.has(block.TrackNumber)) return;

        const track = tracks.get(block.TrackNumber)!;

        const isTrackComplete = completeTracks.has(track.TrackNumber);

        if (!isTrackComplete) {
            if (track.TrackType == Elements.TrackType.Video) {
                switch (track.CodecID) {
                    case 'V_AV1':
                        break;
                    case 'V_VP9': {
                        const dv = new DataView(block.data);
                        const headerInfo = decodeVP9Header(dv);

                        // It doesn't seem like neither Firefox nor Chromium care about the level. So I just rolled a dice and set it to 1.0
                        const codecString = `vp09.${headerInfo.profile.toString().padStart(2, '0')}.10.${headerInfo.bitDepth.toString().padStart(2, '0')}`;
                        callback({
                            decoderConfig: {
                                codec: codecString,
                                codedWidth: track.Video!.DisplayWidth ?? track.Video!.PixelWidth,
                                codedHeight: track.Video!.DisplayHeight ?? track.Video!.PixelHeight
                            },
                            codec: codecString,
                            trackIndex: block.TrackNumber,
                            framerate: track.Video!.FrameRate!,
                            width: track.Video!.PixelWidth,
                            height: track.Video!.PixelHeight,
                            type: 'video'
                        });
                        completeTracks.add(track.TrackNumber);
                        break;
                    }

                    default:
                        break;
                }
            }
        }

        // Send block
        let curIndex = 0;
        if (track.TrackType == Elements.TrackType.Video) {
            curIndex = blockBuffer.push({
                chunk: {
                    data: block.totalBuffer,
                    timestamp: block.TimeStamp,
                    type: block.hasFlag(BlockFlags.Keyframe) ? 'key' : 'delta'
                },
                trackIndex: block.TrackNumber,
                type: 'chunk'
            });
        } else if (track.TrackType == Elements.TrackType.Audio) {
            curIndex = blockBuffer.push({
                chunk: {
                    data: block.totalBuffer,
                    timestamp: block.TimeStamp,
                    type: block.hasFlag(BlockFlags.Keyframe) ? 'key' : 'delta'
                },
                trackIndex: block.TrackNumber,
                type: 'chunk'
            });
        }
        if (curIndex >= 1000) {
            callback({ type: 'chunks', chunks: blockBuffer });
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
        callback({ type: 'chunks', chunks: blockBuffer });
        blockBuffer = [];
    }

    demuxer.flush();

    callback({
        type: 'done'
    });
}

//#region VP9 header

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

//#region AV1 header

function decodeAV1Header(data: DataView) {
    const firstByte = data.getInt8(0);
    const forbiddenBit = (firstByte >> 7) & 0x1;
    if (forbiddenBit !== 0) {
        throw new Error('Data block does not have a valid AV1 OBU header');
    }
    // Idk man
    const type = (firstByte >> 7) & 0x1;
}

//#region AVC private data

/**
 * @reference https://gitlab.com/mbunkus/mkvtoolnix/-/blob/main/src/common/avc/avcc.cpp?ref_type=heads#L149
 */
function decodeAVCPrivateData(buffer: DataView) {
    if (buffer.byteLength <= 6) return;

    // Skip first, always 1
    let offset = 1;

    const profile_idc = buffer.getUint8(offset++);
    const profile_compat = buffer.getUint8(offset++);
    const level_idc = buffer.getUint8(offset++);

    return {
        profile_idc,
        profile_compat,
        level_idc
    };
}

// #region HEVC private data

function decodeHEVCPrivateData(buffer: DataView) {
    /**
     * @see https://github.com/gpac/mp4box.js/blob/2c15bfd58c095776e6ce1a02dd974d77b51c2129/src/parsing/hvcC.js#L1
     */
    function unpack(stream: DataView) {
        let offset = 1;

        const tempByte = stream.getUint8(offset++);
        const general_profile_space = tempByte >> 6;
        const general_tier_flag = (tempByte & 0x20) >> 5;
        const general_profile_idc = tempByte & 0x1f;

        const general_profile_compatibility_flag = stream.getUint32(offset);
        offset += 4;

        const general_constraint_indicator = new Uint8Array(
            stream.buffer.slice(offset, offset + 6)
        );
        offset += 6;

        const general_level_idc = stream.getUint8(offset++);

        return {
            general_profile_space,
            general_tier_flag,
            general_profile_idc,
            general_profile_compatibility_flag,
            general_constraint_indicator,
            general_level_idc
        };
    }

    /**
     * @see https://github.com/gpac/mp4box.js/blob/fbc03484283e389eae011c99a7a21a09a5c45f40/src/box-codecs.js#L106
     */
    function formatCodecData(data: ReturnType<typeof unpack>) {
        let baseCodec = 'hev1.';
        switch (data.general_profile_space) {
            case 0:
                baseCodec += '';
                break;
            case 1:
                baseCodec += 'A';
                break;
            case 2:
                baseCodec += 'B';
                break;
            case 3:
                baseCodec += 'C';
                break;
        }
        baseCodec += data.general_profile_idc + '.';

        let val = data.general_profile_compatibility_flag;
        let reversed = 0;
        for (let i = 0; i < 32; i++) {
            reversed |= val & 1;
            if (i == 31) break;
            reversed <<= 1;
            val >>= 1;
        }

        baseCodec += decimalToHex(reversed) + '.';

        if (data.general_tier_flag === 0) {
            baseCodec += 'L';
        } else {
            baseCodec += 'H';
        }

        baseCodec += data.general_level_idc;

        let hasByte = false;
        let constraintString = '';

        for (let i = 5; i >= 0; i--) {
            if (data.general_constraint_indicator[i] || hasByte) {
                constraintString =
                    '.' + decimalToHex(data.general_constraint_indicator[i], 0) + constraintString;
                hasByte = true;
            }
        }

        baseCodec += constraintString;

        return baseCodec;
    }

    function decimalToHex(d: number, padding?: number) {
        let hex = Number(d).toString(16);
        padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding;
        while (hex.length < padding) {
            hex = '0' + hex;
        }
        return hex;
    }

    return formatCodecData(unpack(buffer));
}

expose({ demux });
