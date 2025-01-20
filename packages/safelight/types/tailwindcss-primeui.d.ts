declare module 'tailwindcss-primeui' {
    import type { Config, PluginCreator } from 'tailwindcss/types/config';

    const PrimeUiPlugin: { handler: PluginCreator; config?: Partial<Config> };
    export default PrimeUiPlugin;
}
