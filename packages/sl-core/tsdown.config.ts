import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src/index.ts', './src/daguerreo.ts'],
    copy: ['./src/binding/sl_binding_bg.wasm*'],
    dts: {
        oxc: true
    },
    platform: 'browser',
    sourcemap: true,
    exports: {
        devExports: 'development',
        customExports: (exports, { isPublish }) => ({
            ...exports,
            './sl_binding.wasm': isPublish
                ? './dist/sl_binding_bg.wasm'
                : './src/binding/sl_binding_bg.wasm'
        })
    }
});
