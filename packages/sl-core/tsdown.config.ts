import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: './src/index.ts',
    copy: [
        {
            from: './src/binding/sl_binding_bg.wasm*',
            to: './dist/'
        }
    ],
    dts: true,
    exports: false,
    minify: {
        codegen: { removeWhitespace: false },
        mangle: false
    },
    platform: 'browser',
    sourcemap: true,
    target: 'es2020',
    inputOptions: {
        resolve: {
            extensions: ['.js', '.cjs', '.mjs', '.ts']
        }
    },
    outputOptions: {
        format: 'esm',
        entryFileNames: '[name].js'
    }
});
