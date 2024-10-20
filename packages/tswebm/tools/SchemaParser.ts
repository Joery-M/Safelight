import { pascalCase } from 'change-case';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import { fileURLToPath } from 'url';
const url = process.argv[2];

fetch(url)
    .then((res) => res.text())
    .then((data) => {
        const parser = new XMLParser({ ignoreAttributes: false });
        const EBML = parser.parse(data).EBMLSchema.element;
        let result = '';

        // Hex lookup
        result += GenerateElementHexLookup(EBML);

        // Lookup of master elements
        // result += GenerateMasterElementLookup(EBML);
        // Not needed

        // Info for each element type
        result += GenerateElementInfo(EBML);

        // Generate map for events
        result += GenerateEventMap(EBML);

        // Generate type tree
        result += GenerateTypeTree(EBML);

        const outPath = fileURLToPath(new URL('../src/elements.ts', import.meta.url));
        fs.writeFileSync(outPath, result.replaceAll('\n', '\r\n'));
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

function GenerateElementHexLookup(EBML: any) {
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

    result += `export enum MatroskaElements {\n`;
    for (const element of EBML) {
        const jsdoc = generateJsdocDocumentation(
            element,
            `@interface {@link Elements.${element['@_name']}}\n`
        );
        result += `${jsdoc}${element['@_name']} = ${element['@_id']},\n`;
    }
    result += `}\n\n`;

    return result;
}

// Unused
/* function GenerateMasterElementLookup(EBML: any) {
    let result = `export const MasterElements = [\n`;
    result += `    EbmlElements.EBMLHead,\n`;
    result += `    EbmlElements.SignatureSlot,\n`;
    result += `    EbmlElements.SignatureElements,\n`;
    result += `    EbmlElements.SignatureElementList,\n`;

    for (const element of EBML) {
        if (element['@_type'] == 'master') {
            result += `    MatroskaElements.${element['@_name']},\n`;
        }
    }
    result += `];\n`;

    return result;
} */

function GenerateElementInfo(EBML: any) {
    let result = `
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
    pathArray: (MatroskaElements | EbmlElements)[];
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

export const ElementInfo: {[key: number]: Element | undefined} = {
    ${/* Need to add types that dont exist in the matroska spec */ ''}
    [EbmlElements.EBMLHead]: {
        name: 'EBML',
        path: '\\\\EBML',
        pathArray: [EbmlElements.EBMLHead],
        id: '0x1a45dfa3',
        type: ElementType.Master,
    },
    [EbmlElements.EBMLVersion]: {
        name: 'EBMLVersion',
        path: '\\\\EBML\\\\EBMLVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.EBMLVersion],
        id: '0x4286',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
    },
    [EbmlElements.EBMLReadVersion]: {
        name: 'EBMLReadVersion',
        path: '\\\\EBML\\\\EBMLReadVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.EBMLReadVersion],
        id: '0x42F7',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
    },
    [EbmlElements.DocType]: {
        name: 'DocType',
        path: '\\\\EBML\\\\DocType',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.DocType],
        id: '0x4282',
        type: ElementType.String,
        minOccurs: '1',
        maxOccurs: '1',
    },
    [EbmlElements.DocTypeVersion]: {
        name: 'DocTypeVersion',
        path: '\\\\EBML\\\\DocTypeVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.DocTypeVersion],
        id: '0x4287',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
    },
    [EbmlElements.DocTypeReadVersion]: {
        name: 'DocTypeReadVersion',
        path: '\\\\EBML\\\\DocTypeReadVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.DocTypeReadVersion],
        id: '0x4285',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
    },
`;
    for (const element of EBML) {
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
        elementType.pathArray = element['@_path']
            .split('\\')
            .filter((s: string) => s.length > 0)
            .map((s: string) =>
                s === 'EBML'
                    ? 'EbmlElements.EBMLHead'
                    : 'MatroskaElements.' + s.replace(/[^A-z0-9]/, '')
            );

        let type = JSON.stringify(elementType);
        type = type.replace(/(?<=\[[^\]]*)"(?=[^[]*?\])/g, '');
        result += `    [MatroskaElements.${element['@_name']}]: ${type},\n`;
    }
    result += `};\n`;
    result = result.replace(/('|")ElementType\.([A-z0-9]*)('|")/g, 'ElementType.$2');

    return result;
}

function GenerateEventMap(EBML: any) {
    let result = `\nexport type ElementEventMap = {
    ${/* Need to add types that dont exist in the matroska spec */ ''}
    [EbmlElements.EBMLHead]: (data: Elements.EBMLHead) => void,
    [EbmlElements.EBMLVersion]: (data: Elements.EBMLVersion) => void,
    [EbmlElements.EBMLReadVersion]: (data: Elements.EBMLReadVersion) => void,
    [EbmlElements.EBMLMaxIDLength]: (data: Elements.EBMLMaxIDLength) => void,
    [EbmlElements.EBMLMaxSizeLength]: (data: Elements.EBMLMaxSizeLength) => void,
    [EbmlElements.DocType]: (data: Elements.DocType) => void,
    [EbmlElements.DocTypeVersion]: (data: Elements.DocTypeVersion) => void,
    [EbmlElements.DocTypeReadVersion]: (data: Elements.DocTypeReadVersion) => void,
    [EbmlElements.CRC32]: (data: Elements.CRC32) => void,
    // [EbmlElements.void]: (data: Elements.Void) => void, Void elements are skipped entirely
    [EbmlElements.SignatureSlot]: (data: Elements.SignatureSlot) => void,
    [EbmlElements.SignatureAlgo]: (data: Elements.SignatureAlgo) => void,
    [EbmlElements.SignatureHash]: (data: Elements.SignatureHash) => void,
    [EbmlElements.SignaturePublicKey]: (data: Elements.SignaturePublicKey) => void,
    [EbmlElements.Signature]: (data: Elements.Signature) => void,
    [EbmlElements.SignatureElements]: (data: Elements.SignatureElements) => void,
    [EbmlElements.SignatureElementList]: (data: Elements.SignatureElementList) => void,
    [EbmlElements.SignedElement]: (data: Elements.SignedElement) => void,`;
    for (const element of EBML) {
        result += `    [MatroskaElements.${element['@_name']}]: (data: Elements.${element['@_name']}) => void,\n`;
    }

    result += `};\n`;

    return result;
}

function formatJsdocText(text: string) {
    return text
        .split('\n')
        .map((t) => '     * ' + t)
        .join('\n');
}

//#region Generate type tree
function GenerateTypeTree(EBML: any) {
    let result = `
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Elements {
        export interface EBMLHead {
            EBMLVersion: EBMLVersion;
            EBMLReadVersion: EBMLReadVersion;
            EBMLMaxIDLength: EBMLMaxIDLength;
            EBMLMaxSizeLength: EBMLMaxSizeLength;
            DocType: DocType;
            DocTypeVersion: DocTypeVersion;
            DocTypeReadVersion: DocTypeReadVersion;
        }

        export type EBMLVersion = number;
        export type EBMLReadVersion = number;
        // export type EBMLMaxIDLength = number;
        // export type EBMLMaxSizeLength = number;
        export type DocType = string;
        export type DocTypeVersion = number;
        export type DocTypeReadVersion = number;
        export type CRC32 = ArrayBuffer;
        export interface SignatureSlot {
            SignatureAlgo?: SignatureAlgo;
            SignatureHash?: SignatureHash;
            SignaturePublicKey?: SignaturePublicKey;
            Signature?: Signature;
        }
        export enum SignatureAlgo {
            RSA = 1,
            elliptic = 2,
        }
        export enum SignatureHash {
            SHA1_160 = 1,
            MD5 = 2,
        }
        export type SignaturePublicKey = ArrayBuffer;
        export type Signature = ArrayBuffer;
        export interface SignatureElements {
            SignatureElementList?: SignatureElementList
        };
        export interface SignatureElementList {
            SignedElement?: SignedElement
        };
        export type SignedElement = ArrayBuffer;`;

    for (const elem of EBML) {
        result += generateElemInterface(EBML, elem);
    }
    return result + '}\n';
}

function getPathChildren(EBML: any, path: string) {
    const results = [];

    for (const elem of EBML) {
        const elemPath = elem['@_path'];
        if (
            elemPath.startsWith(path) &&
            !elemPath.replace(path, '').slice(1).includes('\\') &&
            elemPath.replace(path, '').slice(1).length > 1
        ) {
            results.push(elem);
        }
    }

    return results;
}
function generateElemInterface(EBML: any, elem: any) {
    let result = '\n' + generateJsdocDocumentation(elem);

    // Generate enum
    if (elem.restriction) {
        result += `export enum ${elem['@_name']} {\n`;

        const values = Array.isArray(elem.restriction.enum)
            ? elem.restriction.enum
            : [elem.restriction.enum];

        values.forEach((value: any) => {
            result += generateJsdocDocumentation(value);
            const label = pascalCase(value['@_label'].replace(/(\(|\))/g, ' ').trim());
            const val = Number.isNaN(parseFloat(value['@_value']))
                ? `'${value['@_value']}'`
                : value['@_value'];

            const quotes = /^[_A-Za-z][_0-9A-Za-z]*$/.test(label) ? '' : "'";
            if (label.startsWith('TargetTypeValue_')) {
                result += `${quotes}${value['@_value']}${quotes} = ${val},\n`;
            } else {
                result += `${quotes}${label}${quotes} = ${val},\n`;
            }
        });
        result += '\n}\n';
        return result;
    }

    // Non-master types
    if (elem['@_type'] !== 'master') {
        let type = 'unknown';
        switch (elem['@_type']) {
            case 'binary':
                type = `ArrayBuffer`;
                break;
            case 'date':
                type = `Date`;
                break;
            case 'float':
                type = `number`;
                break;
            case 'integer':
                type = `number`;
                break;
            case 'string':
                type = `string`;
                break;
            case 'utf-8':
                type = `string`;
                break;
            case 'uinteger':
                type = `number`;
                break;
            default:
                type = `unknown`;
                break;
        }
        return result + `export type ${elem['@_name']} = ${type};\n`;
    }

    // Interface for master elements
    result += `export interface ${elem['@_name']} {\n`;

    const children = getPathChildren(EBML, elem['@_path']);
    children.forEach((child) => {
        let arrSuff = '';
        let optional = '';
        if (!child['@_minOccurs'] || child['@_minver'] || child['@_maxver']) {
            optional = '?';
        }
        if (child['@_maxOccurs'] != '1') {
            arrSuff = '[]';
        }
        result += `\n${child['@_name']}${optional}: ${child['@_name']}${arrSuff};`;
    });

    return result + '}\n';
}

//#endregion

function generateJsdocDocumentation(elem: any, extraLine?: string) {
    let result = `    /**\n`;

    if (extraLine) {
        result += `     * ${extraLine}`;
    }
    if (elem.documentation) {
        if (Array.isArray(elem.documentation)) {
            elem.documentation.forEach((doc: any) => {
                result += `     * @${doc['@_purpose']}\n`;
                result += formatJsdocText(doc['#text']) + '\n';
                result += `     *\n`;
            });
        } else {
            const doc = elem.documentation;
            result += `     * @${doc['@_purpose']}\n`;
            result += formatJsdocText(doc['#text']) + '\n';
            result += `     *\n`;
        }
    }

    const extraComments = ['default', 'range', 'minver', 'maxver', 'maxOccurs', 'minOccurs', 'id'];
    extraComments.forEach((com) => {
        if (elem['@_' + com]) {
            result += `     * @${com} ${elem['@_' + com]}\n`;
        }
    });

    result += `     */\n`;
    return result;
}
