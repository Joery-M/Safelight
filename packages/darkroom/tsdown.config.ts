import { defineConfig } from 'tsdown';
import { rolldown, type Plugin } from 'rolldown';

const raw: Plugin = {
    name: 'raw',
    load: {
        filter: { id: /\?raw$/ },
        async handler(id) {
            const builder = await rolldown({ input: id.replace('?raw', '') });
            const result = await builder.generate({ minify: true });
            return `export default ${JSON.stringify(result.output[0].code)}`;
        }
    }
};

export default defineConfig({
    entry: './src/index.ts',
    plugins: [raw],
    sourcemap: true,
    minify: { codegen: { removeWhitespace: false }, mangle: false },
    exports: { devExports: 'development' }
});
