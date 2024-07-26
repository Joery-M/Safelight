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

        // Check if outside latest stack item
        this.stack = this.stack.filter((stackItem) => {
            return (
                this.offset >= stackItem.start && this.offset <= stackItem.size + stackItem.start
            );
        });
    }

    pushStack(stackItem: { id: number; size: number; start: number }) {
        this.stack.push(stackItem);
    }

    //#region Data reading

    private readElementInt(element: EbmlElementTag, offset = 0, buffer = this.buffer) {
        const size = element.contentLength;

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

    private readElementUint(element: EbmlElementTag, offset = 0, buffer = this.buffer) {
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

    private readString(start: number = 0, size = 1, buffer = this.buffer) {
        let res = '';
        for (let i = 0; i < size; i++) {
            const byte = buffer.getInt8(i + start);
            if (byte !== 0x00) {
                res += String.fromCharCode(byte);
            }
        }
        return res;
    }
    private readHexString(start: number = 0, size = 1, buffer = this.buffer) {
        let res = '';
        for (let i = 0; i < size; i++) {
            res += buffer
                .getUint8(i + start)
                .toString(16)
                .padStart(2, '0');
        }
        return res;
    }

    private readDate(size: number, start: number = 0, buffer = this.buffer) {
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
    //#endregion Data reading

    //#region Element decoding
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

        return {
            elementId: tag.value,
            contentLength: size.size ?? 0,
            elementTagLength: tag.length + size.length,
            totalLength: (size.size ?? 0) + size.length + tag.length,
            isMaster: MasterElements.includes(tag.value)
        };
    }

    private decodeIntLength(offset = 0, bytes = this.buffer) {
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
    private decodeIDLength(offset = 0, bytes = this.buffer) {
        const index = offset || 0;
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
        const { rest, size } = this.decodeIntLength(start, buffer);
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
    elementToJson(element: EbmlElementTag, extraOffset = 0) {
        const elementInfo = ElementInfo[element.elementId];
        if (elementInfo?.type !== ElementType.Master) {
            return this.readElement(element, extraOffset);
        }

        const elementJson: { [key: string]: any } = {};
        let offset = element.elementTagLength + extraOffset;
        if (extraOffset > 0) {
            console.log(offset, this.readElementTag(offset, this.buffer));
        }
        if (!element) {
            return;
        }

        while (offset < element.totalLength + extraOffset) {
            const elem = this.readElementTag(offset, this.buffer);
            if (extraOffset > 0) {
                console.log(elem);
            }
            if (!elem) break;

            const elemInfo = ElementInfo[elem.elementId];
            if (elemInfo) {
                const result = this.elementToJson(elem, offset);

                const maxOccurs = parseInt(elemInfo.maxOccurs ?? '1');
                if (maxOccurs > 1) {
                    if (!(elemInfo.name in elementJson)) {
                        elementJson[elemInfo.name] = [result];
                    } else {
                        elementJson[elemInfo.name].push(result);
                    }
                } else {
                    elementJson[elemInfo.name] = result;
                }
            }

            offset += elem.totalLength;
        }

        return elementJson;
    }

    private readElement(elem: EbmlElementTag, offset = 0) {
        const elemInfo = ElementInfo[elem.elementId];
        if (elemInfo) {
            let result: any;

            switch (elemInfo.type) {
                case ElementType.Binary:
                    result = this.buffer.buffer.slice(
                        offset + elem.elementTagLength,
                        offset + elem.totalLength
                    );
                    break;
                case ElementType.Date:
                    result = this.readDate(
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
                    result = this.readElementInt(elem, elem.elementTagLength + offset, this.buffer);
                    break;
                case ElementType.Uinteger: {
                    result = this.readElementUint(
                        elem,
                        offset + elem.elementTagLength,
                        this.buffer
                    );
                    break;
                }
                case ElementType.UTF8:
                case ElementType.String:
                    result = this.readString(
                        elem.elementTagLength + offset,
                        elem.contentLength ?? 1,
                        this.buffer
                    );
                    break;
                case ElementType.Master:
                    result = this.elementToJson(elem, offset);
                    break;

                default:
                    break;
            }

            return result;
        }
    }

    private debugReadHex(start = 0, length = 16, buffer = this.buffer) {
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
