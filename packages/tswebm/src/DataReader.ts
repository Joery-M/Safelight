import { EbmlElements, ElementInfo, ElementType } from './elements';

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
    public totalOffset = 0;
    private hasCheckedValidEbml = false;
    private toSlice = 0;

    public stack: { id: number; size: number; start: number }[] = [];

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

        if (!this.hasCheckedValidEbml && this.totalBuffer.byteLength >= 4) {
            // Read first 4 bytes to check if it is an EBML file
            const EbmlHead = this.readElementId();
            if (EbmlHead?.value !== EbmlElements.EBMLHead) {
                throw new Error('Provided file is not an EBML-compatible file');
            }
            this.hasCheckedValidEbml = true;
        }
    }

    sliceBuffer(size: number) {
        // If the slice is larger than the buffer size, save the
        // residual length to subtract it later again
        this.toSlice += size;
        this.offset += size;
        this.totalOffset += size;
        // 1 MB
        if (this.toSlice > 1_000_000) {
            // this.offset += Math.min(this.toSlice, this.totalBuffer.byteLength);
            this.totalBuffer = this.totalBuffer.slice(this.toSlice);
            this.offset -= this.toSlice;
            this.toSlice = 0;
        }

        // Check if outside latest stack item
        this.stack = this.stack.filter((stackItem) => {
            return (
                this.totalOffset >= stackItem.start &&
                this.totalOffset <= stackItem.size + stackItem.start
            );
        });
    }

    pushStack(stackItem: { id: number; size: number; start: number }) {
        this.stack.push(stackItem);
    }

    //#region Element decoding
    readElementTag(offset = 0, bytes = this.buffer): undefined | EbmlElementTag {
        if (offset >= bytes.byteLength) {
            return;
        }
        const tag = this.readElementId(offset, bytes);

        if (!tag || offset + tag.length >= bytes.byteLength) {
            // Means buffer was too small
            return;
        }
        const size = this.readElementSize(offset + tag.length, bytes);
        if (!size) {
            // Means buffer was too small
            return;
        }

        return {
            elementId: tag.value,
            contentLength: size.size ?? 0,
            elementTagLength: tag.length + size.length,
            totalLength: (size.size ?? 0) + size.length + tag.length,
            isMaster: ElementInfo[tag.value]?.type == ElementType.Master
        };
    }

    private decodeIntLength(offset = 0, bytes = this.buffer) {
        const index = offset || 0;
        if (offset >= bytes.byteLength) {
            return undefined;
        }
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
        } else {
            size = 8;
            rest = 0;
        }

        return {
            size,
            rest
        };
    }
    private decodeIDLength(offset = 0, bytes = this.buffer) {
        const index = offset || 0;
        if (index >= bytes.byteLength) {
            return;
        }
        const byte = bytes.getUint8(index);

        if (byte >= 128) return 1;
        else if (byte >= 64) return 2;
        else if (byte >= 32) return 3;
        else if (byte >= 16) return 4;

        const length = this.decodeIntLength(byte);
        console.log('Invalid length for ID:', length);
    }
    private readElementId(offset = 0, buffer = this.buffer) {
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
    private readElementSize(offset = 0, buffer = this.buffer) {
        const start = offset || 0;
        const intSize = this.decodeIntLength(start, buffer);
        if (!intSize) {
            return undefined;
        }
        const { rest, size } = intSize;

        if (size + start > buffer.byteLength) {
            return undefined;
        }

        let value: number | null = rest;

        if (size > 1) {
            // Get UInt for each possible size
            switch (size) {
                case 1: {
                    const mask = 1 << (size * 7);
                    value = buffer.getUint8(start) & ~mask;
                    break;
                }
                case 2: {
                    const mask = 1 << (size * 7);
                    value = buffer.getUint16(start) & ~mask;
                    break;
                }
                case 3: {
                    const mask = 1 << (size * 7);
                    value = buffer.getUint16(start);
                    value <<= 8;
                    value += buffer.getUint8(start + 2);
                    value &= ~mask;
                    break;
                }
                case 4: {
                    const mask = 1 << (size * 7);
                    value = buffer.getUint32(start) & ~mask;
                    break;
                }

                default: {
                    const mask = BigInt(1) << BigInt(size * 7);
                    value = Number(buffer.getBigUint64(start) & ~mask);
                    break;
                }
            }
        }

        if (value == 2 ** (7 * size) - 1) {
            value = null;
        }

        return {
            size: value,
            length: size
        };
    }
    //#endregion Element decoding

    /**
     * Convert an element to a JSON representation
     */
    elementToJson(element: EbmlElementTag, extraOffset = this.offset) {
        if (!element) {
            return;
        }
        const elementInfo = ElementInfo[element.elementId];
        if (elementInfo?.type !== ElementType.Master) {
            return this.readElement(element, extraOffset);
        }

        const elementJson: { [key: string]: any } = {};
        let offset = element.elementTagLength + extraOffset;

        if (element.totalLength + extraOffset >= this.buffer.byteLength) {
            return;
        }

        while (offset < element.totalLength + extraOffset) {
            const elem = this.readElementTag(offset, this.buffer);
            if (!elem) break;

            const elemInfo = ElementInfo[elem.elementId];
            if (elemInfo) {
                const result = this.elementToJson(elem, offset);

                const maxOccurs = parseInt(elemInfo.maxOccurs ?? '2');
                if (maxOccurs > 1) {
                    if (!(elemInfo.name in elementJson)) {
                        elementJson[elemInfo.name] = [result];
                    } else {
                        elementJson[elemInfo.name].push(result);
                    }
                } else {
                    elementJson[elemInfo.name] = result;
                }
            } else {
                console.log('No elem info', elem);
            }

            offset += elem.totalLength;
        }

        return elementJson;
    }

    private readElement(elem: EbmlElementTag, offset = 0) {
        const elemInfo = ElementInfo[elem.elementId];
        let result: any;

        switch (elemInfo?.type) {
            case ElementType.Date:
                result = Reader.readDate(
                    elem.contentLength!,
                    elem.elementTagLength + offset,
                    this.buffer
                );
                break;
            case ElementType.Float:
                result =
                    elem.contentLength == 4
                        ? this.buffer.getFloat32(elem.elementTagLength + offset)
                        : this.buffer.getFloat64(elem.elementTagLength + offset);
                break;
            case ElementType.Integer:
                result = Reader.readElementInt(elem, elem.elementTagLength + offset, this.buffer);
                break;
            case ElementType.Uinteger: {
                result = Reader.readElementUint(elem, offset + elem.elementTagLength, this.buffer);
                break;
            }
            case ElementType.UTF8:
            case ElementType.String:
                result = Reader.readString(
                    elem.elementTagLength + offset,
                    elem.contentLength ?? 1,
                    this.buffer
                );
                break;
            case ElementType.Master:
                result = this.elementToJson(elem, offset);
                break;

            case ElementType.Binary:
            default:
                result = this.buffer.buffer.slice(
                    offset + elem.elementTagLength,
                    offset + elem.totalLength
                );
                break;
        }

        return result;
    }

    debugReadHex(start = this.offset, length = 16, buffer = this.buffer) {
        return new Array(length)
            .fill('')
            .map((_, i) =>
                buffer
                    .getUint8(i + start)
                    .toString(16)
                    .padStart(2, '0')
            )
            .join(' ');
    }

    flush() {
        this.totalBuffer = new ArrayBuffer(0);
        this.offset = 0;
        this.totalOffset = 0;
        this.hasCheckedValidEbml = false;
        this.stack = [];
        this.toSlice = 0;
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

export class Reader {
    static readElementInt(size: number, offset: number, buffer: DataView): number | bigint;
    static readElementInt(
        element: EbmlElementTag,
        offset: number,
        buffer: DataView
    ): number | bigint;
    static readElementInt(
        element: EbmlElementTag | number,
        offset = 0,
        buffer: DataView
    ): number | bigint {
        const size = typeof element === 'number' ? element : element.contentLength;

        let value: number | bigint;
        switch (size) {
            case 1: {
                value = buffer.getInt8(offset);
                break;
            }
            case 2: {
                value = buffer.getInt16(offset);
                break;
            }
            case 3: {
                value = buffer.getInt16(offset);
                value <<= 8;
                value += buffer.getInt8(offset + 2);
                break;
            }
            case 4: {
                value = buffer.getInt32(offset);
                break;
            }
            case 5: {
                value = BigInt(buffer.getInt32(offset));
                value <<= 8n;
                value += BigInt(buffer.getInt8(offset + 4));
                break;
            }
            case 6: {
                value = BigInt(buffer.getInt32(offset));
                value <<= 16n;
                value += BigInt(buffer.getInt16(offset + 4));
                break;
            }
            case 7: {
                value = BigInt(buffer.getInt32(offset));
                value <<= 16n;
                value += BigInt(buffer.getInt16(offset + 4));
                value <<= 8n;
                value += BigInt(buffer.getInt8(offset + 6));
                break;
            }

            default: {
                value = buffer.getBigInt64(offset);
                break;
            }
        }

        return value;
    }

    static readElementUint(element: EbmlElementTag, offset = 0, buffer: DataView) {
        const size = element.contentLength;

        let value: number | bigint;
        switch (size) {
            case 1: {
                value = buffer.getUint8(offset);
                break;
            }
            case 2: {
                value = buffer.getUint16(offset);
                break;
            }
            case 3: {
                value = buffer.getUint16(offset);
                value <<= 8;
                value += buffer.getUint8(offset + 2);
                break;
            }
            case 4: {
                value = buffer.getUint32(offset);
                break;
            }
            case 5: {
                value = BigInt(buffer.getUint32(offset));
                value <<= 8n;
                value += BigInt(buffer.getUint8(offset + 4));
                break;
            }
            case 6: {
                value = BigInt(buffer.getUint32(offset));
                value <<= 16n;
                value += BigInt(buffer.getUint16(offset + 4));
                break;
            }
            case 7: {
                value = BigInt(buffer.getUint32(offset));
                value <<= 16n;
                value += BigInt(buffer.getUint16(offset + 4));
                value <<= 8n;
                value += BigInt(buffer.getUint8(offset + 6));
                break;
            }

            default: {
                value = buffer.getBigUint64(offset);
                break;
            }
        }

        return value;
    }

    static readString(start: number = 0, size = 1, buffer: DataView) {
        let res = '';
        for (let i = 0; i < size; i++) {
            const byte = buffer.getInt8(i + start);
            if (byte !== 0x00) {
                res += String.fromCharCode(byte);
            }
        }
        return res;
    }
    static readHexString(start: number = 0, size = 1, buffer: DataView) {
        let res = '';
        for (let i = 0; i < size; i++) {
            res += buffer
                .getUint8(i + start)
                .toString(16)
                .padStart(2, '0');
        }
        return res;
    }

    static readDate(size: number, start: number = 0, buffer: DataView) {
        // Dates are normalized to start of millennium
        // https://matroska-org.github.io/libebml/specs.html
        const startMillennium = 978303600000;
        const num = BigInt(this.readElementInt(size, start, buffer)) / 1_000_000n;
        return new Date(startMillennium + Number(num));
    }

    static readVInt(offset = 0, bytes: DataView) {
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
        } else {
            size = 8;
            rest = 0;
        }

        return {
            size,
            rest
        };
    }
}
