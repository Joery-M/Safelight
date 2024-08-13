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
