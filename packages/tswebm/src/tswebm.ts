import { EventEmitter } from 'tseep';
import { Block } from './Block';
import { DataReader, EbmlElementTag, Reader } from './DataReader';
import { EbmlElements, ElementEventMap, ElementInfo, MatroskaElements } from './elements';

export class WebmReader {
    private reader = new DataReader();
    private events = new EventEmitter<ReaderEvents>();

    on: EventEmitter<ReaderEvents>['on'] = (...args) => this.events.on(...args);
    off: EventEmitter<ReaderEvents>['off'] = (...args) => this.events.off(...args);
    once: EventEmitter<ReaderEvents>['once'] = (...args) => this.events.once(...args);
    addListener: EventEmitter<ReaderEvents>['addListener'] = (...args) =>
        this.events.addListener(...args);
    removeListener: EventEmitter<ReaderEvents>['removeListener'] = (...args) =>
        this.events.removeListener(...args);

    appendChunk(buffer: ArrayBufferLike) {
        this.reader.appendBuffer(buffer);
        this.readElements();
        this.events.emit('chunkDone');
    }

    private lastTimestampOffset = 0;

    readElements() {
        // eslint-disable-next-line no-constant-condition
        loop: while (true) {
            let element: EbmlElementTag | undefined;
            try {
                element = this.reader.readElementTag(this.reader.offset);
            } catch (error) {
                console.log(error);
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
                break loop;
            }

            if (element.elementId == MatroskaElements.Timestamp) {
                this.lastTimestampOffset = Number(
                    Reader.readElementUint(element, this.reader.offset, this.reader.buffer)
                );
            }

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
                            this.events.hasListeners(element.elementId) ||
                            (element.elementId == MatroskaElements.SimpleBlock &&
                                this.events.hasListeners('block'))
                        ) {
                            const data = this.reader.elementToJson(element);
                            if (!data) {
                                // Not enough data, come back later
                                break loop;
                            }

                            // Extra behavior
                            switch (element.elementId) {
                                case MatroskaElements.SimpleBlock: {
                                    if (this.events.hasListeners('block')) {
                                        const block = new Block(data, this.lastTimestampOffset);

                                        this.events.emit('block', block);
                                    }
                                    break;
                                }

                                default:
                                    break;
                            }

                            this.events.emit(element.elementId as keyof ElementEventMap, data);
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
        }
    }

    flush() {
        this.lastTimestampOffset = 0;
        this.reader.flush();
    }
}

// Currently nothing excluded
type ExcludedElems = [];

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

export type ReaderEvents = {
    block: (data: Block) => void;
    chunkDone: () => void;
    unknownElement: (element: UnknownEbmlElement) => void;
} & {
    [elem in Exclude<keyof ElementEventMap, ExcludedElems[number]>]: ElementEventMap[elem];
};

export { Block, BlockFlags } from './Block';
export { EbmlElements, Elements, ElementType, MatroskaElements, type Element } from './elements';
