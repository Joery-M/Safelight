import typescript from '@rollup/plugin-typescript';
import path from 'pathe';
import { premove } from 'premove';
import { defineConfig } from 'rolldown';
import { glob } from 'tinyglobby';
import { fileURLToPath } from 'url';
import packageJSON from './package.json' with { type: 'json' };

const SOURCE_DIR = fileURLToPath(import.meta.resolve('./src/'));
const DIST_DIR = fileURLToPath(import.meta.resolve('./dist/'));
const DEFINE = {
    __TEST__: 'false'
};

await premove('./dist/');

/**
 * @type {import('rolldown').Plugin}
 */
const clean = {
    name: 'clean',
    async generateBundle() {
        await premove('./dist/');
    }
};

/**
 * @type {import('rolldown').Plugin}
 */
const stubDts = {
    name: 'stub-dts',
    renderChunk(_c, chunk) {
        if (!chunk.isEntry) return;
        const baseName = path.basename(chunk.fileName, path.extname(chunk.fileName));
        const dtsFile = path.join(path.dirname(chunk.fileName), baseName + '.d.ts');
        this.emitFile({
            type: 'asset',
            fileName: dtsFile,
            originalFileName: chunk.fileName,
            name: baseName,
            id: dtsFile,
            source: `export * from ${JSON.stringify(chunk.facadeModuleId)}`
        });
    }
};

// Read entries from package.json
const entries = await glob(
    Object.values(packageJSON.exports).map(({ development }) => development),
    {
        cwd: import.meta.dirname
    }
);

/**
 *
 * @param {import('rolldown').PreRenderedChunk} chunk
 */
function copySrcFileTree(chunk) {
    if (chunk.facadeModuleId?.startsWith(SOURCE_DIR)) {
        const newPath = chunk.facadeModuleId.replace(SOURCE_DIR, DIST_DIR);
        return path.relative(
            DIST_DIR,
            // Replace extension
            path.join(path.dirname(newPath), path.basename(newPath, path.extname(newPath)) + '.js')
        );
    }
    return chunk.name + '.js';
}

const isWatching = process.argv.includes('-w') || process.argv.includes('--watch');

export default defineConfig({
    input: entries,
    define: DEFINE,
    plugins: [
        isWatching && clean,
        isWatching && stubDts,
        !isWatching &&
            typescript({
                tsconfig: fileURLToPath(import.meta.resolve('../../tsconfig.json')),
                outDir: fileURLToPath(import.meta.resolve('./dist/')),
                cacheDir: fileURLToPath(import.meta.resolve('./node_modules/.cache/typescript/')),
                outputToFilesystem: isWatching,
                incremental: isWatching,
                tsBuildInfoFile: fileURLToPath(
                    import.meta.resolve('./node_modules/.cache/typescript/tsconfig.tsbuildinfo')
                ),
                include: [
                    fileURLToPath(import.meta.resolve('./src/**/*.ts')),
                    fileURLToPath(import.meta.resolve('../../types/globals.d.ts'))
                ],
                compilerOptions: {
                    emitDeclarationOnly: true,
                    declaration: true,
                    composite: false
                }
            })
    ],
    treeshake: true,
    external: Object.keys(packageJSON.dependencies),
    output: [
        {
            format: 'esm',
            dir: 'dist',
            entryFileNames: copySrcFileTree,
            sourcemap: isWatching,
            minify: true
        }
    ]
});
