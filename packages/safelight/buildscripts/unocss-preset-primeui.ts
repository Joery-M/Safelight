import type { Preset } from 'unocss';

interface PresetPrimeOptions {
    /**
     * Enable shortcuts for using `presetIcons` for PrimeIcons (ex. `pi-bars` and utilities like `pi-spin`).
     *
     * Requires installing the `@iconify-json/prime` package and configuring `presetIcons` in your UnoCSS config file.
     *
     * @default false
     */
    icons?: boolean;
}

const COLOR_RANGE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const THEME_COLORS = [
    'blue',
    'green',
    'yellow',
    'cyan',
    'pink',
    'indigo',
    'teal',
    'orange',
    'bluegray',
    'purple',
    'red',
    'gray',
    'primary',
    'surface'
] as const;

type ColorRangeMap<C extends string = string> = {
    [K in (typeof COLOR_RANGE)[number]]: `var(--p-${C}-${K})`;
};
type ThemeColorsMap = {
    [K in (typeof THEME_COLORS)[number]]: ColorRangeMap<K> & { DEFAULT: `var(--p-${K}-500)` };
};

function generateColorRange(color: string) {
    return COLOR_RANGE.reduce(
        (result, number) => ({
            ...result,
            [number]: `var(--p-${color}-${number})`
        }),
        {}
    ) as ColorRangeMap;
}
function generateColorRangeWithDefault(color: string) {
    const result = generateColorRange(color);
    return { ...result, DEFAULT: result[500] };
}
function generateThemeColors() {
    return THEME_COLORS.reduce(
        (result, color) => ({
            ...result,
            [color]: generateColorRangeWithDefault(color)
        }),
        {} as ThemeColorsMap
    );
}

const colors = generateThemeColors();
const primeThemeColors = {
    ...colors,
    primary: {
        ...colors.primary,
        DEFAULT: 'var(--p-primary-color)',
        text: 'var(--p-primary-color-text)'
    },
    text: {
        color: 'var(--p-text-color)',
        secondary: 'var(--p-surface-400)'
    },
    surface: {
        0: 'var(--p-surface-0)',
        ...colors.surface
    }
};
const primeTheme = {
    colors: primeThemeColors
};
function presetPrime(options?: PresetPrimeOptions) {
    const { icons = false } = options ?? {};
    const preset: Preset = {
        name: 'unocss-preset-prime',
        theme: primeTheme,
        shortcuts: [
            {
                'bg-primary': 'bg-primary text-primary-text',
                'bg-primary-reverse': 'bg-primary-text text-primary',
                'text-color': 'text-text-color',
                'text-color-secondary': 'text-text-secondary'
            }
        ]
    };
    if (icons) {
        if (!Array.isArray(preset.shortcuts)) preset.shortcuts = [];
        preset.shortcuts.push(
            [/^pi-(.*)$/, ([, d]) => `i-prime-${d} i-scale-prime inline-block align-middle`],
            {
                'i-scale-prime': '[scale:130%]',
                'pi-fw': 'w-1.28571429em',
                'pi-spin': 'animate-spin animate-duration-2s'
            }
        );
    }
    return preset;
}

export { presetPrime, primeTheme, primeThemeColors };
