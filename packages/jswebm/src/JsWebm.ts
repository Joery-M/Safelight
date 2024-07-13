import { DataReader } from './DataReader';

export class JsWebm {
    private reader = new DataReader();
    private currentOffset = 0;

    appendChunk(buffer: ArrayBufferLike) {
        this.reader.appendBuffer(buffer);
        this.readElements();
    }

    readElements() {
        // while (true) {
        const elementId = this.reader.readElementTag(this.reader.buffer);
        console.log(elementId);
        // break;
        // }
    }
}
