# TsWebm

A tool to read webm, mkv, mks, mka files in the browser. Technically you can read any EBML-compatible file using the emitted events, but that's up to you.

### What makes this different than [jswebm](https://github.com/jscodec/jswebm)?

Since Matroska, and by extension, webm, have their file schemas [publicly available](https://github.com/ietf-wg-cellar/matroska-specification/blob/master/ebml_matroska.xml), it's possible to extract interfaces, enums and primitive types to be used in Typescript. And that is exactly what this package does.

## Table of Contents

<!-- prettier-ignore -->
- [TsWebm](#tswebm)
    - [What makes this different than jswebm?](#what-makes-this-different-than-jswebm)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
    - [Why do I listen to events first?](#why-do-i-listen-to-events-first)
    - [Why read synchronously?](#why-read-synchronously)
  - [Example](#example)
    - [Basic reading](#basic-reading)
- [Caveats/Known issues](#caveatsknown-issues)
- [Reading VP9 codec string for WebCodecs](#reading-vp9-codec-string-for-webcodecs)
- [Reading H.264/AVC codec string for WebCodecs](#reading-h264avc-codec-string-for-webcodecs)
- [Reading H.265/HEVC codec string for WebCodecs](#reading-h265hevc-codec-string-for-webcodecs)

## Usage

To start reading a file, first, create the reader, then start listening to events, then push buffers to the reader.

> [!TIP]
> It's possible to append an entire file as 1 chunk.
>
> Do remember that the file would have to be loaded in memory

### Why do I listen to events first?

Reading happens synchronously the moment you call `appendChunk`, meaning that any event listeners called after `appendChunk`, are already too late.

### Why read synchronously?

In this case it's easier to convert synchronous reading into a multi-threaded process, than it is to turn asynchronous reading into a synchronous job. Basically, it's up to you to decide whether to run synchronously or asynchronously.

## Example

### Basic reading

```ts
import { WebmReader, MatroskaElements } from '@safelight/tswebm';

// Fetch webm file
const fileBlob = await fetch('https://your.webm/file').then((r) => r.blob());
// Get file stream
const fileStream = fileBlob.stream().getReader();

const reader = new WebmReader();

// Register a type-safe event
reader.on(MatroskaElements.TrackEntry, (data) => {
    console.log('Found a track!', data);
});

while (true) {
    const chunk = await fileStream.read();

    // Occurs when stream is done
    if (!chunk || chunk.done) {
        console.log('Done!');
        break;
    }

    // Send chunk to reader
    reader.appendChunk(chunk.value.buffer);
}

// Flush left-over data (if any)
reader.flush();
```

# Caveats/Known issues

1. There is no clear sign when reading has stalled due to corrupt or bad data.
2. Blocks of unknown size are **not** currently supported.

# Reading VP9 codec string for WebCodecs

WebCodecs requires a codec string to decode encoded chunks. VP9 requires [extra parameters](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#vp9) that aren't immediately obvious just looking at the file.

To get the profile number, you need to read the VP9 header of a chunk. Here is some code translated from the [reader](https://github.com/webmproject/libvpx/blob/fcd1f39e569eeb8d9956ab6f44193c55a7337e76/vpx_dsp/bitreader_buffer.c#L17-L29) and [decoder](https://github.com/webmproject/libvpx/blob/fcd1f39e569eeb8d9956ab6f44193c55a7337e76/vp9/decoder/vp9_decodeframe.c#L2948-L2953) of [libvpx](https://www.webmproject.org/code/):

```ts
/**
 * Read VP9 or VP8 bit.
 *
 * @param {DataView} buffer of the raw frame data
 *
 * @see {@link https://github.com/webmproject/libvpx/blob/fcd1f39e569eeb8d9956ab6f44193c55a7337e76/vpx_dsp/bitreader_buffer.c#L17-L29|Original libvpx code}
 */
function vpx_rb_read_bit(buffer: DataView, offset = 0) {
    const p = offset >> 3;
    const q = 7 - (offset & 0x7);
    if (p < buffer.byteLength) {
        const bit = (buffer.getUint8(p) >> q) & 1;
        return bit;
    } else {
        throw new Error('No data');
    }
}

/**
 * Read bit depth flag which defines if a chunk is 10 or 12 bit.
 *
 * Only exists when profile is more than 2 and if the frame is a keyframe
 */
function read_bit_depth_flag(buffer: DataView, profile: number, offset = 2) {
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
        throw new Error('Frame was a reference to another frame, could not read bit-depth flag');
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
}

/**
 * Read profile number from VP9 header
 *
 * @param {DataView} buffer of the raw frame data
 * @param {number} [offset=2] Where to start looking for the profile string. 2 by default to skip `FRAME_MARKER`. See figure 4.1 of the documentation linked below
 *
 * @see {@link http://downloads.webmproject.org/docs/vp9/vp9-bitstream_superframe-and-uncompressed-header_v1.0.pdf|VP9 header documentation}
 * @see {@link https://web.archive.org/web/20240406001513/http://downloads.webmproject.org/docs/vp9/vp9-bitstream_superframe-and-uncompressed-header_v1.0.pdf|Archived version}
 *
 * @see {@link https://github.com/webmproject/libvpx/blob/fcd1f39e569eeb8d9956ab6f44193c55a7337e76/vp9/decoder/vp9_decodeframe.c#L2948-L2953|Original libvpx code}
 */
function read_profile(buffer: DataView, offset = 2) {
    let profile = vpx_rb_read_bit(buffer, offset);
    profile |= vpx_rb_read_bit(buffer, offset + 1) << 1;

    if (profile > 2) {
        profile += vpx_rb_read_bit(buffer, offset + 2);
    }
    return profile;
}
```

And here is how you can use tswebm to read that profile number:

```ts
import { BlockFlags, MatroskaElements } from '@safelight/tswebm';

// Initialize decoder
const decoder = new VideoDecoder({
    error: (err) => console.error(err),
    output: (frame: VideoFrame) => {
        // Draw to canvas or whatever you want
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        frame.close();
    }
});
// The track number of the video
let vidTrackNum: number | null = null;

reader.on(MatroskaElements.TrackEntry, (track) => {
    if (track.TrackType == Elements.TrackType.Video && track.CodecID === 'V_VP9') {
        vidTrackNum = track.TrackNumber;
        console.log('Video track is found on track:', vidTrackNum);
    }
});

reader.on('block', (block) => {
    if (vidTrackNum !== null && block.TrackNumber === vidTrackNum) {
        const isKeyframe = block.hasFlag(BlockFlags.Keyframe);
        if (decoder.state == 'unconfigured') {
            // Create a view so we can read the data
            const data = new DataView(block.data);
            const profile = read_profile(data).toString().padStart(2, '0');
            const bitDepth = read_bit_depth_flag(data, profile).toString().padStart(2, '0');

            // Chrome and Firefox seem to just accept any valid level
            const level = '10';

            let bitDepthBitOffset = decoder.configure({
                codec: `vp09.${profile}.${level}.${bitDepth}`
            });
        }
        const chunk = new EncodedVideoChunk({
            data: block.data,
            timestamp: block.TimeStamp,
            type: isKeyframe ? 'key' : 'delta'
        });
        decoder.decode(chunk);
    }
});
```

# Reading H.264/AVC codec string for WebCodecs

Reading AVC codec is a bit simpler, all required data is stored in the `CodecPrivate`. So by parsing that data, a codec string can be made.

```ts
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

    // No need to read lists like in mkvtoolnix

    return {
        profile_idc,
        profile_compat,
        level_idc
    };
}
```

```ts
import { BlockFlags, MatroskaElements } from '@safelight/tswebm';

// Initialize decoder
const decoder = new VideoDecoder({
    error: (err) => console.error(err),
    output: (frame: VideoFrame) => {
        // Draw to canvas or whatever you want
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        frame.close();
    }
});
// The track number of the video
let vidTrackNum: number | null = null;

reader.on(MatroskaElements.TrackEntry, (track) => {
    if (
        track.TrackType == Elements.TrackType.Video &&
        track.CodecID === 'V_MPEG4/ISO/AVC' &&
        track.CodecPrivate
    ) {
        vidTrackNum = track.TrackNumber;
        console.log('Video track is found on track:', vidTrackNum);

        // Decode codec string
        const view = new DataView(track.CodecPrivate);
        const codecData = decodeAVCPrivateData(view);

        if (!codecData) {
            console.error('Could not decode AVC data');
            return;
        }

        // Format numbers
        // For example: from `10` to hex `0a`
        const profile = codecData.profile_idc.toString(16).padStart(2, '0');
        const constraint = codecData.profile_compat.toString(16).padStart(2, '0');
        const level = codecData.level_idc.toString(16).padStart(2, '0');

        const codecString = `avc1.${profile}${constraint}${level}`;

        decoder.configure({
            codec: codecString
        });
    }
});

reader.on('block', (block) => {
    if (vidTrackNum !== null && block.TrackNumber === vidTrackNum) {
        const isKeyframe = block.hasFlag(BlockFlags.Keyframe);
        const chunk = new EncodedVideoChunk({
            data: block.data,
            timestamp: block.TimeStamp,
            type: isKeyframe ? 'key' : 'delta'
        });
        decoder.decode(chunk);
    }
});
```

# Reading H.265/HEVC codec string for WebCodecs

Reading HEVC codec string is a little difficult, but nonetheless, the amazing people at mp4box.js have done the most of the hard lifting here.

> [!WARNING]
> At the time of writing this, Firefox does not support HEVC by default.

```ts
/**
 * @reference https://github.com/gpac/mp4box.js/blob/2c15bfd58c095776e6ce1a02dd974d77b51c2129/src/parsing/hvcC.js#L1
 */
function unpackHevcPrivateData(stream: DataView) {
    let offset = 1;

    const tempByte = stream.getUint8(offset++);
    const general_profile_space = tempByte >> 6;
    const general_tier_flag = (tempByte & 0x20) >> 5;
    const general_profile_idc = tempByte & 0x1f;

    const general_profile_compatibility_flag = stream.getUint32(offset);
    offset += 4;

    const general_constraint_indicator = new Uint8Array(stream.buffer.slice(offset, offset + 6));
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
 * @reference https://github.com/gpac/mp4box.js/blob/fbc03484283e389eae011c99a7a21a09a5c45f40/src/box-codecs.js#L106
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
```

```ts
import { BlockFlags, MatroskaElements } from '@safelight/tswebm';

// Initialize decoder
const decoder = new VideoDecoder({
    error: (err) => console.error(err),
    output: (frame: VideoFrame) => {
        // Draw to canvas or whatever you want
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        frame.close();
    }
});
// The track number of the video
let vidTrackNum: number | null = null;

reader.on(MatroskaElements.TrackEntry, (track) => {
    if (
        track.TrackType == Elements.TrackType.Video &&
        track.CodecID === 'V_MPEGH/ISO/HEVC' &&
        track.CodecPrivate
    ) {
        vidTrackNum = track.TrackNumber;
        console.log('Video track is found on track:', vidTrackNum);

        // Decode codec string
        const view = new DataView(track.CodecPrivate);
        const codecString = formatCodecData(unpackHevcPrivateData(view));

        if (!codecData) {
            console.error('Could not decode HEVC data');
            return;
        }

        decoder.configure({
            codec: codecString
        });
    }
});

reader.on('block', (block) => {
    if (vidTrackNum !== null && block.TrackNumber === vidTrackNum) {
        const isKeyframe = block.hasFlag(BlockFlags.Keyframe);
        const chunk = new EncodedVideoChunk({
            data: block.data,
            timestamp: block.TimeStamp,
            type: isKeyframe ? 'key' : 'delta'
        });
        decoder.decode(chunk);
    }
});
```
