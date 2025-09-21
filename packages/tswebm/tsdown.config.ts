import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: './src/*.ts',
    sourcemap: true,
    minify: { codegen: true, mangle: false },
    exports: { devExports: 'development' }
});
