import { DataReader, EbmlElementTag } from './DataReader';
import { EbmlElements, MatroskaElements } from './elements';

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
                element = this.reader.readElementTag();
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

            switch (element.elementId) {
                case EbmlElements.void:
                    // Void the void
                    break;
                case MatroskaElements.Tag: {
                    console.log('Tag');
                    const res = this.reader.elementToJson(element);
                    console.log(res);
                    break;
                }
                case EbmlElements.EBMLHead:
                    console.log('Head', this.reader.elementToJson(element));
                    break;

                case MatroskaElements.SimpleBlock:
                    // console.log('WE PLAYING MINECRAFT IN HERE');
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
            } else {
                this.reader.sliceBuffer(element.totalLength);
            }
        }
    }
}
