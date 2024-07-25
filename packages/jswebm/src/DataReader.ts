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
        let res = '';
        for (let i = 0; i < size; i++) {
            res += String.fromCharCode(buffer.getInt8(i + start));
        }
        return res;
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
        if (offset == bytes.byteLength) {
            return;
        }
        const tag = this.readElementId(offset, bytes);

        if (!tag || bytes.byteLength < offset + tag.length) {
            console.log('No tag');
            return;
        }
        const size = this.readElementSize(offset + tag.length, bytes);
        if (!size) {
            console.log('No size');
            return;
        }
        console.log(tag, size);

        return {
            elementId: tag.value,
            contentLength: size.size ?? 0,
            elementTagLength: tag.length + size.length,
            totalLength: (size.size ?? 0) + size.length + tag.length,
            isMaster: MasterElements.includes(tag.value)
        };
    }
    decodeIntLength(offset = 0, bytes = this.buffer) {
        const index = offset || 0;
        const byte = bytes.getUint8(index);

        let size = 0;
        let rest = 0;

        if (byte >= 128) {
            size = 1;
            rest = byte & 0b1111111;
        } else if (byte >= 64) {
            size = 2;
            rest = byte & 0b111111;
        } else if (byte >= 32) {
            size = 3;
            rest = byte & 0b11111;
        } else if (byte >= 16) {
            size = 4;
            rest = byte & 0b1111;
        } else if (byte >= 8) {
            size = 5;
            rest = byte & 0b111;
        } else if (byte >= 4) {
            size = 6;
            rest = byte & 0b11;
        } else if (byte >= 2) {
            size = 7;
            rest = byte & 0b1;
        }

        return {
            size,
            rest
        };
    }
    decodeIDLength(offset = 0, bytes = this.buffer) {
        const index = offset || 0;
        const byte = bytes.getUint8(index);

        if (byte >= 128) return 1;
        else if (byte >= 64) return 2;
        else if (byte >= 32) return 3;
        else if (byte >= 16) return 4;
        else if (byte >= 8) return 5;

        const length = this.decodeIntLength(byte);
        console.log('Invalid length for ID:', length);
    }
    readElementId(offset = 0, buffer = this.buffer) {
        const start = offset || 0;

        const length = this.decodeIDLength(start, buffer) ?? 0;

        if (length > 4) {
            console.log('Length too long:', length);
            return;
        } else if (length == 0) {
            console.log('Element length not found');
            return;
        }

        let value = 0;

        for (let i = 0; i < length; i++) {
            value *= 2 ** 8;
            value += buffer.getUint8(start + i);
        }
        return { value, length };
    }
    readElementSize(offset = 0, buffer = this.buffer) {
        const start = offset || 0;
        const { rest, size } = this.decodeIntLength(start, buffer);
        let value: number | null = rest;

        if (size > 1) {
            value = Number(buffer.getBigUint64(start));
        }

        if (value == 2 ** (7 * size) - 1) {
            value = null;
        }

        return {
            size: value,
            length: size
        };
    }

    elementToJson(element: EbmlElementTag) {
        if (!MasterElements.includes(element.elementId)) {
            return;
        }

        const elementJson: { [key: string]: any } = {};
        let offset = 0;
        console.log('START READING JSON');

        console.log(element);
        const data = new DataView(
            this.buffer.buffer,
            this.offset + element.elementTagLength,
            element.contentLength
        );
        console.log(data.byteLength);

        if (!element) {
            return;
        }

        while (offset < element.contentLength) {
            const elem = this.readElementTag(offset, data);
            if (!elem) break;

            const elemInfo = ElementInfo[elem.elementId as keyof typeof ElementInfo];
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
                        result = this.readString(
                            elem.elementTagLength + offset,
                            elem.contentLength ?? 1,
                            data
                        );
                        break;

                    default:
                        break;
                }
                elementJson[elemInfo.name] = result;
            }

            offset += elem.totalLength;
        }
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
    contentLength: number;

    isMaster: boolean;
}
