import { EbmlElements, ElementInfo, ElementType, MasterElements } from './elements';

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
    readHexString(start: number = 0, size = 1, buffer = this.buffer) {
        let res = '';
        for (let i = 0; i < size; i++) {
            res += buffer
                .getUint8(i + start)
                .toString(16)
                .padStart(2, '0');
        }
        return res;
    }

    readDate(size: number, start: number = 0, buffer = this.buffer) {
        switch (size) {
            case 1:
                return new Date(buffer.getUint8(start));
            case 2:
                return new Date(buffer.getUint16(start));
            case 4:
                return new Date(buffer.getUint32(start));
            case 8:
                return new Date(Number.parseInt(this.readHexString(0, size, buffer), 16));
            default:
                return new Date(0);
        }
    }

    readElementTag(offset = 0, bytes = this.buffer): undefined | EbmlElementTag {
        const tag = this.readVint(true, bytes, offset);
        if (!tag || bytes.byteLength < offset + tag.length) return;
        const size = this.readVint(false, bytes, offset + tag.length);

        return {
            elementId: tag.value,
            contentLength: size.value ?? 0,
            elementTagLength: size.length,
            totalLength: size.value + size.length,
            isMaster: MasterElements.includes(tag.value)
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
    readVint2(buffer = this.buffer, start = 0) {
        const length = 8 - Math.floor(Math.log2(buffer.getUint8(start)));
        if (length > 8) {
            throw new Error(`Unrepresentable length: ${length}`);
        }

        if (start + length > buffer.byteLength) {
            return null;
        }

        let value = buffer.getUint8(start) & ((1 << (8 - length)) - 1);
        for (let i = 1; i < length; i += 1) {
            if (i === 7) {
                if (value >= 2 ** 45 && buffer.getUint8(start + 7) > 0) {
                    return { length, value: -1 };
                }
            }
            value *= 2 ** 8;
            value += buffer.getUint8(start + i);
        }

        return { length, value };
    }
    readVint(id = false, buffer = this.buffer, start = 0) {
        const startByte = buffer.getUint8(start);

        if (startByte == 0) throw new Error('Variable int is too large to parse');

        let width = 0;
        for (; width < 8; width++) {
            if (startByte >= Math.pow(2, 7 - width)) break;
        }

        if (start + width + 1 > buffer.byteLength)
            throw new Error('Missing bytes, not enough data to parse variable int');

        // remove the mark bit for non-id values
        let value = startByte;
        if (!id) value -= Math.pow(2, 7 - width);

        // for each trailing byte: shift the existing bits left by a byte, and
        // add the new byte to the value. again, we don't use bit operations
        // for speed, but also because << is performed on 32bits.
        for (let i = 1; i <= width; i++) {
            value *= Math.pow(2, 8);
            value += buffer.getUint8(start + i);
        }

        start += width + 1;
        return { value, length: start };
    }

    elementToJson(element: EbmlElementTag) {
        if (!MasterElements.includes(element.elementId)) {
            return;
        }

        const elementJson: { [key: string]: any } = {};
        let offset = 0;
        console.log('START READING JSON');

        const data = new DataView(
            this.buffer.buffer,
            this.offset + element.elementTagLength,
            element.totalLength
        );
        console.log(data.byteLength);
        while (offset < element.totalLength) {
            const elem = this.readElementTag(offset, data);
            console.log(elem);
            if (!elem) break;

            const elemInfo = ElementInfo[elem.elementId as keyof typeof ElementInfo];
            console.log(elemInfo, elem.elementId);
            if (elemInfo) {
                let result: any;

                switch (elemInfo.type) {
                    case ElementType.Binary:
                        result = data.buffer.slice(
                            offset + elem.elementTagLength,
                            offset + elem.totalLength
                        );
                        break;
                    case ElementType.Date:
                        result = this.readDate(
                            elem.contentLength!,
                            elem.elementTagLength + offset,
                            data
                        );
                        break;
                    case ElementType.Float:
                        result =
                            elem.contentLength == 4
                                ? data.getFloat32(elem.elementTagLength + offset)
                                : data.getFloat64(elem.elementTagLength + offset);
                        break;
                    case ElementType.Integer:
                        break;
                    case ElementType.Uinteger:
                        result = this.readUInt8(
                            elem.elementTagLength + offset,
                            elem.contentLength,
                            data
                        );
                        break;
                    case ElementType.String:
                        // FIX
                        console.log(elem.contentLength);
                        result = this.readString(elem.elementTagLength, elem.contentLength, data);
                        break;

                    default:
                        break;
                }
                elementJson[elemInfo.name] = result;
            }

            offset += elem.totalLength;
        }
        console.log('STOP READING JSON', elementJson);
    }
}

export interface EbmlElementTag {
    /**
     * Element ID
     */
    elementId: number;
    /**
     * Size of the tag of this element in bytes
     */
    elementTagLength: number;
    /**
     * Length of this entire element, including content, in bytes
     */
    totalLength: number;
    /**
     * Length of the content inside this element in bytes
     */
    contentLength?: number;

    isMaster: boolean;
}
