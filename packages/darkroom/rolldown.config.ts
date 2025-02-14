import { premove } from 'premove';
import { defineConfig, type Plugin, rolldown } from 'rolldown';
import IsolatedDecl from 'unplugin-isolated-decl/rolldown';

const clean = () => {
    return {
        name: 'clean',
        async buildStart() {
            await premove('./dist/');
        }
    } satisfies Plugin;
};

const raw = () => {
    return {
        name: 'raw',
        async load(id) {
            if (id.endsWith('?raw')) {
                const builder = await rolldown({ input: id.replace('?raw', '') });
                const result = await builder.generate({ minify: true });
                return `export default ${JSON.stringify(result.output[0].code)}`;
            }
        }
    } satisfies Plugin;
};

export default defineConfig({
    input: './src/index.ts',
    plugins: [clean(), raw(), IsolatedDecl()],
    treeshake: true,
    output: [
        {
            dir: 'dist',
            esModule: true,
            minify: true
        }
    ]
});
