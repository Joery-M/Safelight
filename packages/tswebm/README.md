# TsWebm

A tool to read webm, mkv, mks, mka files in the browser. Technically you can read any EBML-compatible file using the emitted events, but that's up to you.

### What makes this different than [jswebm](https://github.com/jscodec/jswebm)?

Since Matroska, and by extension, webm, have their file schemas [publicly available](https://github.com/ietf-wg-cellar/matroska-specification/blob/master/ebml_matroska.xml), it's possible to extract interfaces, enums and primitive types to be used in Typescript.

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
    // Skipping version and high
    offset += 2;
    // Skipping RESERVED_ZERO
    if (profile > 2) offset += 1;
    // Skipping `show_existing_frame`
    offset += 1;
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
    if (track.TrackType == Elements.TrackType.Video) {
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
            const profile = read_profile(data);

            // Chrome seems to just accept any valid level
            const level = '10';
            const bitDepth = '08';

            let bitDepthBitOffset = decoder.configure({
                codec: `vp09.${profile.toString().padStart(2, '0')}.${level}.${bitDepth}`
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
