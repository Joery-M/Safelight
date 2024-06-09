import { createMD5 } from 'hash-wasm';
import { DateTime } from 'luxon';
import type { MediaInfoResult } from 'mediainfo.js';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../base/Storage';
import { getFileInfo } from '../helpers/Files/GetFileInfo';
import { generateMediaThumbnail } from '../helpers/Video/GenerateMediaThumbnail';
import {
    MediaType,
    type AudioTrackInfo,
    type ImageInfo,
    type TextTrackInfo,
    type VideoTrackInfo
} from '../Media/Media';

const chunkSize = 64 * 1024 * 1024;

export default class MediaManager {
    static StoreMedia(file: File) {
        return new Observable<LoadMediaProgress>((subscriber) => {
            // Thanks RxJs, makes sense
            (async () => {
                // Hash file
                const reader = new FileReader();

                const hasher = await createMD5();

                function hashChunk(chunk: Blob) {
                    return new Promise<void>((resolve) => {
                        reader.onload = async (e) => {
                            const view = new Uint8Array(e.target!.result! as ArrayBuffer);
                            hasher.update(view);
                            resolve();
                        };

                        reader.readAsArrayBuffer(chunk);
                    });
                }

                const chunkNumber = Math.ceil(file.size / chunkSize);

                for (let i = 0; i <= chunkNumber; i++) {
                    const chunk = file.slice(
                        chunkSize * i,
                        Math.min(chunkSize * (i + 1), file.size)
                    );
                    await hashChunk(chunk);
                    subscriber.next({
                        hashProgress: Math.min(i / chunkNumber, 1),
                        type: 'hash'
                    });
                }

                const hash = hasher.digest();

                // Check if a file with the same hash is already stored, if so, use it
                const existingMedia = await Storage.getStorage().getMediaFromHash(hash);

                if (existingMedia) {
                    subscriber.next({
                        type: 'done',
                        id: existingMedia.id,
                        hashProgress: 1
                    });
                } else {
                    // Generate fileInfo
                    subscriber.next({
                        type: 'fileInfo',
                        hashProgress: 1
                    });
                    const fileInfo = await getFileInfo(file);

                    // Get thumbnail
                    subscriber.next({
                        hashProgress: 1,
                        type: 'thumbnail'
                    });
                    const thumbnail = (await generateMediaThumbnail(file)) ?? undefined; // Typescript shenanigans

                    const uuid = uuidv4();

                    const trackInfo = this.parseFileInfo(fileInfo);

                    let type: MediaType = 0;

                    if (trackInfo.videoTracks.length > 0) {
                        type = type | MediaType.Video;
                    }
                    if (trackInfo.audioTracks.length > 0) {
                        type = type | MediaType.Audio;
                    }
                    if (trackInfo.textTracks.length > 0) {
                        type = type | MediaType.Text;
                    }
                    if (trackInfo.imageInfo) {
                        type = type | MediaType.Image;
                    }

                    Storage.getStorage().SaveMedia({
                        id: uuid,
                        name: file.name,
                        contentHash: hash,
                        data: file,
                        fileInfo,
                        previewImage: thumbnail,
                        type,
                        ...trackInfo,
                        created: DateTime.now().toISO()
                    });
                    subscriber.next({
                        type: 'done',
                        id: uuid,
                        hashProgress: 1
                    });
                }

                subscriber.complete();
            })();
        });
    }

    private static parseFileInfo(info: MediaInfoResult) {
        const videoTracks: VideoTrackInfo[] = [];
        const audioTracks: AudioTrackInfo[] = [];
        const textTracks: TextTrackInfo[] = [];
        const sampledDurations: number[] = [];
        let imageInfo: ImageInfo | undefined;

        info.media?.track.forEach((track) => {
            if (track['@type'] == 'Video') {
                videoTracks.push({
                    title: track.Title ?? `Video Track ${videoTracks.length + 1}`,
                    bitDepth: track.BitDepth!,
                    codec: (track.CodecID ?? track.Format)!,
                    colorSpace: track.ColorSpace!,
                    frameRate: track.FrameRate!,
                    frameRateMode:
                        track.FrameRate_Mode === 'CFR' || !track.FrameRate_Mode ? 'CFR' : 'VFR',
                    height: track.Height!,
                    width: track.Width!,
                    isHDR: 'HDR_Format' in track,
                    duration: track.Duration!
                });
                if (track.Duration) {
                    sampledDurations.push(track.Duration);
                }
            } else if (track['@type'] == 'Audio') {
                audioTracks.push({
                    title: track.Title ?? `Audio Track ${audioTracks.length + 1}`,
                    channels: track.Channels ?? 1,
                    codec: track.CodecID ?? track.Format ?? 'Unknown codec',
                    sampleRate: track.SamplingRate ?? 0,
                    duration: track.Duration ?? 0
                });
                if (track.Duration) {
                    sampledDurations.push(track.Duration);
                }
            } else if (track['@type'] == 'Image') {
                imageInfo = {
                    format: track.Format!,
                    height: track.Height!,
                    width: track.Width!
                };
            } else if (track['@type'] == 'Text') {
                textTracks.push({
                    format: track.Format!
                });
            }
        });

        return {
            videoTracks,
            audioTracks,
            textTracks,
            imageInfo,
            duration: Math.max(...sampledDurations)
        };
    }
}

interface LoadMediaProgress {
    type: 'fileInfo' | 'thumbnail' | 'hash' | 'done';
    id?: string;
    hashProgress: number;
}
