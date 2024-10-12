import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { Plugin } from 'vite';

export default function generatePlugin(options: Options): Plugin {
    return {
        name: 'generate-i18n-types',
        async buildStart() {
            try {
                await compileTypes(options);
            } catch (error) {
                if ((error as Error).name !== 'SyntaxError') {
                    console.error('Error generating i18n types:', error);
                }
            }
        },
        async watchChange(id) {
            const isInDir = path.resolve(id).startsWith(path.resolve(options.localesDir));
            if (isInDir) {
                try {
                    await compileTypes(options);
                } catch (error) {
                    if ((error as Error).name !== 'SyntaxError') {
                        console.error('Error generating i18n types:', error);
                    }
                }
            }
            return undefined;
        }
    };
}

interface Options {
    localesDir: string;
    outputFile: string;
}

async function compileTypes({ localesDir: dir, outputFile: output }: Options) {
    const files = await glob(dir + '/*.json', {
        signal: AbortSignal.timeout(1000)
    });

    // Combine all files into 1 object
    const allFiles: Record<string, any> = {};
    mergeDeep(
        allFiles,
        ...(await Promise.all(files.map(async (path) => JSON.parse(await readFile(path, 'utf-8')))))
    );
    const { localeSettings, ...messages } = allFiles ?? {};

    if (!messages) {
        return;
    }

    // Start of file
    let outputFile = `import 'vue-i18n';
declare module 'vue-i18n' {
    export interface DefineLocaleMessage `;

    // Add JSON file, and replace all values with "string"
    let jsonRes = JSON.stringify(
        messages,
        (_, value) => (typeof value == 'object' ? value : 'string'),
        4
    );

    // Convert "keys" to keys
    jsonRes = jsonRes.replace(/"([^"]*)"(?=:)/g, '$1');
    // Convert "string" to string
    jsonRes = jsonRes.replace(/(?<=: )"([^"]*)",?/g, '$1;');

    // Format to not get complaints from prettier
    jsonRes = jsonRes
        .split('\n')
        .map((line, i) => {
            if (i == 0) {
                return line;
            } else {
                if (line.endsWith(' }')) {
                    line = line.replace(' }', ' };');
                }
                if (line.endsWith(' },')) {
                    line = line.replace(' },', ' };');
                }
                return '    ' + line;
            }
        })
        .join('\n');
    outputFile += jsonRes;
    // Finishing touches
    outputFile += `\n}\n`;
    // LF to CRLF
    outputFile = outputFile.replace(/((?<!\r)\n|\r(?!\n))/g, '\r\n');

    // No need to wait for finishing writing, if it does take long, skip it
    writeFile(output, outputFile, { signal: AbortSignal.timeout(100) });
}

// Source: https://stackoverflow.com/a/34749873
function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
function mergeDeep(target: Record<string, any>, ...sources: Record<string, any>[]) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}
