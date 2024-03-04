import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            formats: ['es'],
            entry: path.resolve(__dirname, 'lib/main.ts'),
            name: 'darkroom'
        }
    }
});
