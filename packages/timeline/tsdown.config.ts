import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: {
        index: './src/index.ts',
        devtools: './src/devtools.ts',
        elements: './src/elements/index.ts',
        // Kinda shit, but whatever, gonna refactor timeline anyway
        'elements/MoveableTimelineItem': './src/elements/MoveableTimelineItem.ts',
        'elements/TimelineCursorElement': './src/elements/TimelineCursorElement.ts',
        'elements/TimelineGrid': './src/elements/TimelineGrid.ts',
        'elements/TimelineLayer': './src/elements/TimelineLayer.ts',
        'elements/TimelineScrollbar': './src/elements/TimelineScrollbar.ts',
        'elements/VideoTimelineElement': './src/elements/VideoTimelineElement.ts'
    },
    sourcemap: true,
    minify: { codegen: { removeWhitespace: false }, mangle: false },
    exports: { devExports: 'development' }
});
