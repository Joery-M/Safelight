import { premove } from 'premove';
import { defineConfig, rolldown } from 'rolldown';
import IsolatedDecl from 'unplugin-isolated-decl/rolldown';
import packageJSON from './package.json' with { type: 'json' };

/**
 * @type {import('rolldown').Plugin}
 */
const clean = {
    name: 'clean',
    async buildStart() {
        await premove('./dist/');
    }
};

/**
 * @type {import('rolldown').Plugin}
 */
const raw = {
    name: 'raw',
    async load(id) {
        if (id.endsWith('?raw')) {
            const builder = await rolldown({ input: id.replace('?raw', '') });
            const result = await builder.generate({ minify: true });
            return `export default ${JSON.stringify(result.output[0].code)}`;
        }
    }
};

export default defineConfig({
    input: './src/index.ts',
    plugins: [clean, raw, IsolatedDecl()],
    treeshake: true,
    external: Object.keys(packageJSON.dependencies),
    output: [
        {
            dir: 'dist',
            esModule: true,
            minify: true
        }
    ]
});
