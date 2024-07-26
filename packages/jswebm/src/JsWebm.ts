import { Block, BlockFlags } from './Block';
import { DataReader, EbmlElementTag } from './DataReader';
import { EbmlElements, ElementInfo, MatroskaElements } from './elements';

export { Block } from './Block';

export class JsWebm {
    private reader = new DataReader();

    appendChunk(buffer: ArrayBufferLike) {
        this.reader.appendBuffer(buffer);
        this.readElements();
    }

    readElements() {
        // eslint-disable-next-line no-constant-condition
        whileLoop: while (true) {
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
                break whileLoop;
            }
            // if (element.elementId !== EbmlElements.void) {
            //     if (element.elementId in ElementInfo) {
            //         console.log(
            //             this.reader.stack.map((item) => ElementInfo[item.id]?.name).join(' > '),
            //             '>',
            //             ElementInfo[element.elementId]?.name
            //         );
            //     } else {
            //         console.log(`Could not find element info for '${element.elementId.toString(16)}' at position ${this.reader.totalOffset}`);
            //         console.log('%c' + this.reader.debugReadHex(), '');
            //     }
            // }

            switch (element.elementId) {
                case EbmlElements.void:
                    // Void the void
                    break;
                case EbmlElements.EBMLHead:
                    console.log('Head', this.reader.elementToJson(element));
                    break;
                case MatroskaElements.SimpleBlock: {
                    const data = this.reader.elementToJson(element);
                    console.log('SimpleBlock', data);
                    const block = new Block(data);
                    console.log(
                        block.Flags.toString(2).padStart(8, '0'),
                        block.hasFlag(BlockFlags.XiphLacing)
                    );
                    break;
                }

                case MatroskaElements.TrackEntry:
                    console.log('TrackEntry', this.reader.elementToJson(element));
                    break;
                default:
                    // console.log(
                    //     'Unknown element:',
                    //     element.elementId.toString(16),
                    //     ', size:',
                    //     element.totalLength,
                    //     ', is master element:',
                    //     isMasterElement,
                    //     'Name:',
                    //     ElementInfo[element.elementId].name
                    // );
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
        this.reader.flush();
    }
}
