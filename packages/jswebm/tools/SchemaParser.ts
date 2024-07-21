import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import { join } from 'path';
const url = process.argv[2];

fetch(url)
    .then((res) => res.text())
    .then((data) => {
        // Base
        let result = `export enum EbmlElements {
    EBMLHead = 0x1a45dfa3,
    EBMLVersion = 0x4286,
    EBMLReadVersion = 0x42f7,
    EBMLMaxIDLength = 0x42f2,
    EBMLMaxSizeLength = 0x42f3,
    DocType = 0x4282,
    DocTypeVersion = 0x4287,
    DocTypeReadVersion = 0x4285,
    CRC32 = 0xbf,
    void = 0xec,
    SignatureSlot = 0x1b538667,
    SignatureAlgo = 0x7e8a,
    SignatureHash = 0x7e9a,
    SignaturePublicKey = 0x7ea5,
    Signature = 0x7eb5,
    SignatureElements = 0x7e5b,
    SignatureElementList = 0x7e7b,
    SignedElement = 0x6532
}\n\n`;

        const parser = new XMLParser({ ignoreAttributes: false });
        result += `export enum MatroskaElements {\n`;
        for (const element of parser.parse(data).EBMLSchema.element) {
            result += `    ${element['@_name']} = ${element['@_id']},\n`;
        }
        result += `}\n\n`;

        // Lookup of master elements
        result += `export const MasterElements = [\n`;
        result += `    EbmlElements.EBMLHead,\n`;
        result += `    EbmlElements.SignatureSlot,\n`;
        result += `    EbmlElements.SignatureElements,\n`;
        result += `    EbmlElements.SignatureElementList,\n`;

        for (const element of parser.parse(data).EBMLSchema.element) {
            if (element['@_type'] == 'master') {
                result += `    MatroskaElements.${element['@_name']},\n`;
            }
        }
        result += `];\n`;

        result += `
export enum ElementType {
    Binary = 'binary',
    Date = 'date',
    Float = 'float',
    Integer = 'integer',
    Master = 'master',
    String = 'string',
    UTF8 = 'utf-8',
    Uinteger = 'uinteger'
}

export interface Element {
    name: string;
    path: string;
    id: string;
    type: ElementType;
    maxOccurs?: string;
    recurring?: string;
    minOccurs?: string;
    unknownsizeallowed?: string;
    default?: string;
    minver?: string;
    maxver?: string;
    range?: string;
    length?: string;
    recursive?: string;
}

export const ElementInfo = {
    ${/* Need to add types that dont exist in the matroska spec */ ''}
    [EbmlElements.EBMLHead]: {
        name: 'EBML',
        path: '\\EBML',
        id: '0x1a45dfa3',
        type: ElementType.Master,
    },
    [EbmlElements.EBMLVersion]: {
        name: 'EBMLVersion',
        path: '\\EBML\\EBMLVersion',
        id: '0x4286',
        type: ElementType.Uinteger,
    },
    [EbmlElements.EBMLReadVersion]: {
        name: 'EBMLReadVersion',
        path: '\\EBML\\EBMLReadVersion',
        id: '0x42F7',
        type: ElementType.Uinteger,
    },
    [EbmlElements.DocType]: {
        name: 'DocType',
        path: '\\EBML\\DocType',
        id: '0x4282',
        type: ElementType.String,
    },
    [EbmlElements.DocTypeVersion]: {
        name: 'DocTypeVersion',
        path: '\\EBML\\DocTypeVersion',
        id: '0x4287',
        type: ElementType.Uinteger,
    },
    [EbmlElements.DocTypeReadVersion]: {
        name: 'DocTypeReadVersion',
        path: '\\EBML\\DocTypeReadVersion',
        id: '0x4285',
        type: ElementType.Uinteger,
    },
`;
        for (const element of parser.parse(data).EBMLSchema.element) {
            const elementType: { [key: string]: any } = {};
            for (const key in element) {
                if (!key.startsWith('@_')) {
                    continue;
                }

                if (Object.prototype.hasOwnProperty.call(element, key)) {
                    let value = element[key];
                    if (key == '@_type') {
                        value = getEnumFromType(value);
                    }
                    elementType[key.replace('@_', '')] = value;
                }
            }
            result += `    /**\n`;
            result += `     * @type MatroskaElements.${element['@_name']}\n`;

            if (element.documentation) {
                if (Array.isArray(element.documentation)) {
                    element.documentation.forEach((doc: any) => {
                        result += `     * @${doc['@_purpose']}\n`;
                        result += `     * ${doc['#text']}\n`;
                        result += `     *\n`;
                    });
                } else {
                    const doc = element.documentation;
                    result += `     * @${doc['@_purpose']}\n`;
                    result += `     * ${doc['#text']}\n`;
                    result += `     *\n`;
                }
            }

            result += `     */\n`;
            result += `    ${element['@_id']}: ${JSON.stringify(elementType)},\n`;
        }
        result += `};\n`;
        result = result.replace(/('|")ElementType\.([A-z0-9]*)('|")/g, 'ElementType.$2');

        fs.writeFileSync(join(import.meta.dirname, '../src/elements.ts'), result);
    });

function getEnumFromType(type: string): string {
    const map: { [key: string]: string } = {
        binary: 'ElementType.Binary',
        date: 'ElementType.Date',
        float: 'ElementType.Float',
        integer: 'ElementType.Integer',
        master: 'ElementType.Master',
        string: 'ElementType.String',
        'utf-8': 'ElementType.UTF8',
        uinteger: 'ElementType.Uinteger'
    };
    return map[type] ?? 'unknown';
}
