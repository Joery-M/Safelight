import { EbmlElements } from './elements';

export class DataReader {
    private _totalBuffer = new ArrayBuffer(0);
    public get totalBuffer() {
        return this._totalBuffer;
    }
    public set totalBuffer(value) {
        this._totalBuffer = value;
        this.buffer = new DataView(value);
    }
    public buffer = new DataView(this.totalBuffer);
    /**
     * Amount of data that has been sliced off already
     */
    public offset = 0;
    private hasCheckedValidEbml = false;
    private sliceRes = 0;

    appendBuffer(buffer: ArrayBufferLike) {
        // Transfer is faster, but not widely supported
        if (this.totalBuffer.transfer) {
            const oldLength = this.totalBuffer.byteLength;
            this.totalBuffer = this.totalBuffer.transfer(oldLength + buffer.byteLength);
            const view = new Uint8Array(this.totalBuffer);
            const view2 = new Uint8Array(buffer);
            view.set(view2, oldLength);
        } else {
            const oldSize = this.totalBuffer.byteLength;
            const newBuffer = new ArrayBuffer(oldSize + buffer.byteLength);
            const newView = new Uint8Array(newBuffer);
            newView.set(new Uint8Array(this.totalBuffer));
            newView.set(new Uint8Array(buffer), oldSize);

            this.totalBuffer = newBuffer;
        }
        if (this.sliceRes > 0) {
            this.sliceBuffer(this.sliceRes);
        }

        if (!this.hasCheckedValidEbml && this.totalBuffer.byteLength >= 4) {
            // Read first 4 bytes to check if it is an EBML file
            const EbmlHead = this.readElementTag();
            if (EbmlHead?.elementId !== EbmlElements.EBMLHead) {
                throw new Error('Provided file is not an EBML-compatible file');
            }
            this.hasCheckedValidEbml = true;
            this.sliceBuffer(EbmlHead.elementTagLength);
        }
    }

    sliceBuffer(size: number) {
        // If the slice is larger than the buffer size, save the
        // residual length to subtract it later again
        if (size > this.totalBuffer.byteLength) {
            this.sliceRes = size - this.totalBuffer.byteLength;
        } else {
            this.sliceRes = 0;
        }
        this.offset += Math.min(size, this.totalBuffer.byteLength);
        this.totalBuffer = this.totalBuffer.slice(size);
    }

    readUInt8(start: number = 0, size = 1, buffer = this.buffer) {
        let data = 0;

        for (let offset = 0; offset < size; offset++) {
            data <<= 8;
            data += buffer.getUint8(start + offset);
        }

        return data;
    }
    readInt8(start: number = 0, size = 1, buffer = this.buffer) {
        let data = 0;

        for (let offset = 0; offset < size; offset++) {
            data <<= 8;
            data += buffer.getInt8(start + offset);
        }

        return data;
    }
    readString(start: number = 0, size = 1, buffer = this.buffer) {
        let data = '';

        for (let offset = 0; offset < size; offset++) {
            data += String.fromCharCode(buffer.getInt8(start + offset));
        }

        return data;
    }
    readElementTag(
        offset = 0,
        readContentSize = true,
        bytes = this.buffer
    ): undefined | EbmlElementTag {
        let index = offset && offset > 0 ? offset : 0;
        let count = 1;
        let length = bytes.getUint8(index);
        let bytesRead = 1;
        let lengthMask = 0x80;

        if (!length) {
            return;
        }

        while (!(length & lengthMask)) {
            bytesRead++;
            lengthMask >>= 1;
        }

        while (count++ < bytesRead) {
            length = (length << 8) | bytes.getUint8(++index);
        }

        const content = readContentSize ? this.readElementSize(bytesRead) : undefined;

        return {
            elementIdSize: bytesRead,
            elementId: length,
            contentLength: content?.value,
            elementTagLength: (content?.elementIdSize ?? 0) + bytesRead,
            totalLength: bytesRead + (content?.value ?? 0) + (content?.elementIdSize ?? 0)
        };
    }
    readElementSize(offset = 0, bytes = this.buffer) {
        let index = offset && offset > 0 ? offset : 0;
        let count = 1;
        let length = bytes.getUint8(index);
        let bytesRead = 1;
        let lengthMask = 0x80;

        if (!length) {
            return;
        }

        while (!(length & lengthMask)) {
            bytesRead++;
            lengthMask >>= 1;
        }

        length &= ~lengthMask;
        while (count++ < bytesRead) {
            length = (length << 8) | bytes.getUint8(++index);
        }

        return {
            elementIdSize: bytesRead,
            value: length
        };
    }
}

export interface EbmlElementTag {
    /**
     * Size of the element ID in bytes
     */
    elementIdSize: number;
    /**
     * Element ID
     */
    elementId: number;
    /**
     * Size of the tag of this element in bytes
     */
    elementTagLength: number;
    /**
     * Length of the content inside this element in bytes
     */
    contentLength?: number;
    /**
     * Length of this entire element, including content, in bytes
     */
    totalLength: number;
}
