import { Subscription } from 'rxjs';
import { Storage } from '../base/Storage';
import { FileDemuxer } from '../Demuxer/FileDemuxer';
import {
    ChunkedMediaFileItem,
    type ChunkOffset,
    type CompatibleDecoderConfig
} from '../Media/ChunkedMediaFile';
import { MediaSourceType, type MediaItem } from '../Media/Media';
import { DateTime } from 'luxon';

export default class MediaManager {
    static storeMedia(file: File) {
        const storage = Storage.getStorage();
        return new Promise<MediaItem>(async (resolve, reject) => {
            const videoDemuxer = await FileDemuxer.getDemuxer(file);
            if (videoDemuxer) {
                const media = new ChunkedMediaFileItem();
                // Set base media stuff
                const path = storage.getBaseFilePath('media-files');
                media.addMetadata('file.location', [...path, media.id]);
                media.addMetadata('file.name', file.name);
                media.name = file.name;

                const chunkOffsets: ChunkOffset[] = [];

                let fileDemuxer$: Subscription;
                let offsetInFile = 0;

                const tracks: { [key: number]: CompatibleDecoderConfig } = {};

                let sourceType: MediaSourceType = MediaSourceType.Unknown;

                const stream = new ReadableStream<BufferSource>({
                    start(controller) {
                        fileDemuxer$ = videoDemuxer.demuxFile(file).subscribe({
                            next: async (output) => {
                                if (output.type == 'chunks') {
                                    for (const chunk of output.chunks) {
                                        controller.enqueue(chunk.chunk.data);

                                        chunkOffsets.push({
                                            size: chunk.chunk.data.byteLength,
                                            start: offsetInFile,
                                            trackIndex: chunk.trackIndex,
                                            keyFrame: chunk.chunk.type == 'key',
                                            timestamp: chunk.chunk.timestamp,
                                            duration: chunk.chunk.duration ?? undefined
                                        });

                                        offsetInFile += chunk.chunk.data.byteLength;
                                    }
                                } else if (output.type == 'audio' || output.type == 'video') {
                                    let desc: ArrayBuffer | undefined;
                                    if (output.decoderConfig.description) {
                                        // Convert SharedArrayBuffer to regular ArrayBuffer
                                        if (ArrayBuffer.isView(output.decoderConfig.description)) {
                                            const view = new Uint8Array(
                                                output.decoderConfig.description.buffer
                                            );
                                            desc = new ArrayBuffer(view.byteLength);
                                            new Uint8Array(desc).set(view);
                                        } else {
                                            desc = output.decoderConfig.description;
                                        }
                                    }

                                    tracks[output.trackIndex] = {
                                        ...output.decoderConfig,
                                        description: desc
                                    };

                                    // Add type
                                    if (output.type == 'audio') {
                                        sourceType |= MediaSourceType.Audio;
                                    } else if (output.type == 'video') {
                                        sourceType |= MediaSourceType.Video;
                                    }
                                }
                            },
                            complete: async () => {
                                controller.close();
                            }
                        });
                    },
                    cancel: () => {
                        fileDemuxer$?.unsubscribe();
                        reject('Stream cancelled');
                    }
                });

                // Wait for promise to finish, since that is when the readableStream
                // is empty and its contents have been written to storage
                await storage.writeStream([...path, media.id], stream);
                // Set other data
                media.addMetadata('source.chunkOffsets', chunkOffsets);
                media.addMetadata('source.tracks', tracks);
                // Coincidentally, offsetInFile is also the raw size of all chunks
                media.addMetadata('file.size', offsetInFile);
                media.addMetadata('media.sourceType', sourceType);
                media.addMetadata('media.created', DateTime.now().toISO());

                await storage.saveMedia(media);
                resolve(media);
                return;
            }

            // TODO: Implement audio demuxer

            // If no demuxer could be found, just write the file to storage and use it
        });
    }

    static generateThumbnail() {}
}
