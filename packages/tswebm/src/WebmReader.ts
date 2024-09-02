import { EventEmitter } from 'eventemitter3';
import { Block } from './Block';
import { DataReader, EbmlElementTag, Reader } from './DataReader';
import { EbmlElements, type ElementEventMap, ElementInfo, MatroskaElements } from './elements';

export class WebmReader {
    private reader: DataReader;
    private events = new EventEmitter<ReaderEvents>();

    /* eslint-disable prettier/prettier */
    public readonly on: EventEmitter<ReaderEvents>['on'] = (...args) => this.events.on(...args);
    public readonly off: EventEmitter<ReaderEvents>['off'] = (...args) => this.events.off(...args);
    // prettier-ignore
    public readonly once: EventEmitter<ReaderEvents>['once'] = (...args) => this.events.once(...args);
    // prettier-ignore
    public readonly addListener: EventEmitter<ReaderEvents>['addListener'] = (...args) => this.events.addListener(...args);
    // prettier-ignore
    public readonly removeListener: EventEmitter<ReaderEvents>['removeListener'] = (...args) => this.events.removeListener(...args);
    /* eslint-enable prettier/prettier */

    appendChunk(buffer: ArrayBufferLike) {
        this.reader.appendBuffer(buffer);
        if (this.config.autoReadElements !== false) {
            this.readElements();
        }
        this.events.emit('chunkDone');
    }

    private lastTimestampOffset = 0;
    private loopDetection = {
        offset: 0,
        times: 0
    };

    constructor(private config: WebmReaderConfig = {}) {
        this.reader = new DataReader(config?.bufferSize);
    }

    /**
     * Called automatically when appending a chunk.
     *
     * Except when `config.autoReadElements` is `false`
     *
     * @param [single=false] Only read 1 element
     */
    readElements<ElementId extends keyof ElementEventMap = keyof ElementEventMap>(single = false) {
        // eslint-disable-next-line no-constant-condition
        loop: while (true) {
            let element: EbmlElementTag | undefined;

            if (this.loopDetection.times > 100) {
                throw new Error(`Reader stalled on offset ${this.reader.totalOffset}, quitting`);
            }

            if (this.loopDetection.offset === this.reader.totalOffset) {
                this.loopDetection.times++;
            } else {
                this.loopDetection.offset = this.reader.totalOffset;
                this.loopDetection.times = 0;
            }

            try {
                element = this.reader.readElementTag(this.reader.offset);
            } catch (error) {
                console.error(
                    'Error reading EBML element. Reader will get stuck on this element.',
                    error
                );
                break;
            }

            const isMasterElement = element?.isMaster;
            if (
                !element ||
                this.reader.buffer.byteLength <
                    (isMasterElement ? element.elementTagLength : element.totalLength) +
                        this.reader.offset
            ) {
                // Come back later when more data has been loaded
                if (single) {
                    return 'Need more data';
                }
                break loop;
            }

            if (element.elementId == MatroskaElements.Timestamp) {
                this.lastTimestampOffset = Number(
                    Reader.readElementUint(element, this.reader.offset, this.reader.buffer)
                );
            }

            let elementResult: Parameters<ElementEventMap[ElementId]>['0'] | undefined = undefined;

            switch (element.elementId) {
                case EbmlElements.void:
                    // Void the void
                    break;
                default:
                    if (!(element.elementId in ElementInfo)) {
                        // Exclude isMaster, since it isn't known for unknown elements
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { isMaster, ...elemWithoutMaster } = element;
                        this.events.emit('unknownElement', {
                            element: elemWithoutMaster,
                            data: this.reader.buffer.buffer.slice(
                                this.reader.offset,
                                this.reader.offset + element.totalLength
                            )
                        });
                    } else {
                        if (
                            this.events.listenerCount(element.elementId) > 0 ||
                            (element.elementId == MatroskaElements.SimpleBlock &&
                                this.events.listenerCount('block'))
                        ) {
                            elementResult = this.reader.elementToJson(element);
                            if (!elementResult) {
                                // Not enough data, come back later
                                if (single) {
                                    return 'Need more data';
                                }
                                break loop;
                            }

                            // Extra behavior
                            switch (element.elementId) {
                                case MatroskaElements.SimpleBlock: {
                                    if (this.events.listenerCount('block') > 0) {
                                        const block = new Block(
                                            elementResult as ArrayBuffer,
                                            this.lastTimestampOffset
                                        );

                                        this.events.emit('block', block);
                                    }
                                    break;
                                }

                                default:
                                    break;
                            }

                            this.events.emit(
                                element.elementId as keyof ElementEventMap,
                                elementResult as any
                            );
                        }
                    }
                    break;
            }
            // Always slice
            if (isMasterElement) {
                this.reader.sliceBuffer(element.elementTagLength);
                this.reader.pushStack({
                    id: element.elementId,
                    size: element.totalLength,
                    start: this.reader.totalOffset
                });
            } else {
                this.reader.sliceBuffer(element.totalLength);
            }
            if (single) {
                return elementResult;
            }
        }
    }

    flush() {
        this.lastTimestampOffset = 0;
        this.reader.flush();
    }
}

export type UnknownEbmlElement = {
    element: {
        /**
         * The parsed element ID of this element
         */
        elementId: number;
        /**
         * Size of the tag of this element in bytes
         *
         * ```text
         * [IIL]000000
         *
         * I = Element ID
         * L = Element length
         * 0 = Data
         * [] = Range of this length
         * ```
         */
        elementTagLength: number;
        /**
         * Length of this entire element, including content, in bytes
         *
         * ```text
         * [IIL000000]
         *
         * I = Element ID
         * L = Element length
         * 0 = Data
         * [] = Range of this length
         * ```
         */
        totalLength: number;
        /**
         * Length of the content inside this element in bytes
         *
         * ```text
         * IIL[000000]
         *
         * I = Element ID
         * L = Element length
         * 0 = Data
         * [] = Range of this length
         * ```
         */
        contentLength: number;
    };
    data: ArrayBuffer;
};

// Currently nothing excluded
type ExcludedElems = [];

export type ReaderEvents = {
    block: (data: Block) => void;
    chunkDone: () => void;
    unknownElement: (element: UnknownEbmlElement) => void;
} & {
    [elem in Exclude<keyof ElementEventMap, ExcludedElems[number]>]: ElementEventMap[elem];
};

export interface WebmReaderConfig {
    /**
     * Automatically start reading elements after appending a chunk.
     *
     * Can be manually called with `WebmReader.readElements()`
     *
     * @default true
     */
    autoReadElements?: boolean;

    /**
     * How large the buffer is allowed to be before slicing off excess data.
     *
     * Slicing is an expensive process, so being able to use a little more RAM to slice large chunks helps with performance.
     *
     * Larger numbers use more RAM, but can result in more performance (not guaranteed).
     *
     * @unit bytes
     * @default 1_000_000 (1 MB)
     */
    bufferSize?: number;
}
