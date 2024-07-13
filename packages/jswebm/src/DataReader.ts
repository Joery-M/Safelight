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
    private offset = 0;
    private hasCheckedValidEbml = false;

    appendBuffer(buffer: ArrayBufferLike) {
        const data = new DataView(buffer);

        if ('transfer' in ArrayBuffer.prototype) {
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

        if (!this.hasCheckedValidEbml && this.totalBuffer.byteLength >= 4) {
            // Read first 4 bytes to check if it is an EBML file
            const tag = this.readElementTag(data, Infinity);
            console.log(tag);
            const EbmlHead = this.readHex(data, 0, 4);
            console.log(EbmlHead);
            if (EbmlHead !== EbmlElements.EBMLHead) {
                throw new Error('Provided file is not an EBML-compatible file');
            }
            this.hasCheckedValidEbml = true;
            this.sliceBuffer(4);
        }
    }

    sliceBuffer(size: number) {
        this.totalBuffer = this.totalBuffer.slice(size);
    }

    readHex(buffer: DataView, start: number, size = 1) {
        let data = 0;

        for (let offset = 0; offset < size; offset++) {
            data <<= 8;
            data += buffer.getUint8(start + offset);
        }

        return data;
    }
    readUntilHex(
        buffer: DataView,
        value: number,
        start = 0,
        maxOffset = Infinity,
        inclusive = false
    ) {
        let data = 0;
        let offset = 0;
        while (maxOffset < offset && start + offset < buffer.byteLength) {
            data <<= 8;
            const byte = buffer.getUint8(start + offset);
            if (byte === value) {
                if (inclusive) {
                    data <<= 8;
                    data += value;
                }
                break;
            }
            data += byte;

            offset++;
        }

        return data;
    }
    readUInt8(buffer: DataView, start: number, size = 1) {
        let data = 0;

        for (let offset = 0; offset < size; offset++) {
            data <<= 8;
            data += buffer.getUint8(start + offset);
        }

        return data;
    }
    readInt8(buffer: DataView, start: number, size = 1) {
        let data = 0;

        for (let offset = 0; offset < size; offset++) {
            data <<= 8;
            data += buffer.getUint8(start + offset);
        }

        return data;
    }
    readElementTag(bytes: DataView, maxSize?: number, offset = 0) {
        let index = offset && offset > 0 ? offset : 0;
        let count = 1;
        let length = bytes.getUint8(index);
        let bytesRead = 1;
        let lengthMask = 0x80;

        if (!length) {
            return null;
        }

        while (bytesRead <= maxSize && !(length & lengthMask)) {
            bytesRead++;
            lengthMask >>= 1;
        }

        if (bytesRead > maxSize) {
            return null;
        }

        length &= ~lengthMask;
        while (count++ < bytesRead) {
            length = (length << 8) | bytes.getUint8(++index);
        }

        return {
            size: bytesRead,
            value: length
        };
    }
}
