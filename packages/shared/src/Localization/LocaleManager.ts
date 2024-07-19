import { reactive, ref } from 'vue';
import { type I18n } from 'vue-i18n';

export class LocaleManager {
    public static activeLocale = ref('en-US');

    public static locales = reactive<{ [locale: string]: () => Promise<LocalizationFile> }>({});

    private static i18n: I18n<{}, {}, {}, string, false>;

    static init(i18n: I18n<{}, {}, {}, string, false>) {
        this.i18n = i18n;

        const globImport = import.meta.glob<LocalizationFile>('./i18n/*.ts', {
            import: 'default'
        });
        Object.entries(globImport).forEach(([path, fn]) => {
            this.registerLocale(path.split('/')[2].split('.')[0]!, fn);
        });

        // HMR for locale files
        if (import.meta.hot) {
            setupHmr();
        }

        const activeLocale = this.activeLocale.value;
        this.switchLocale(activeLocale);
        // this.loadLocale(activeLocale).then(async (localeFile) => {
        //     if (localeFile) {
        //         this.i18n.global.setLocaleMessage(activeLocale, localeFile.messages);
        //         const fallbackLocale = localeFile.fallback ?? 'en-US';
        //         if (fallbackLocale) {
        //             this.i18n.global.fallbackLocale.value = fallbackLocale;
        //         } else {
        //             this.i18n.global.fallbackLocale.value = 'en-US';
        //         }
        //         // Also load fallback
        //         const fallback = await this.loadLocale(fallbackLocale);
        //         if (fallback) {
        //             this.i18n.global.setLocaleMessage(fallbackLocale, fallback.messages);
        //         }
        //     }
        // });
    }

    static async switchLocale(locale: string) {
        const localeFile = await this.loadLocale(locale);
        if (localeFile) {
            this.i18n.global.setLocaleMessage(locale, localeFile.messages);
            const fallbackLocale = localeFile.fallback ?? 'en-US';
            this.i18n.global.fallbackLocale.value = fallbackLocale;

            // Also load fallback asynchronously
            this.loadLocale(fallbackLocale).then((fallback) => {
                if (fallback) {
                    this.i18n.global.setLocaleMessage(fallbackLocale, fallback.messages);
                }
            });

            this.i18n.global.locale.value = locale;
            this.activeLocale.value = locale;

            document.documentElement.setAttribute('lang', locale);
        }
    }

    private static async loadLocale(locale: string) {
        if (!(locale in this.locales)) {
            console.error(`Locale ${locale} not found in registered locales`);
        } else {
            try {
                const messages = await this.locales[locale]();
                return messages;
            } catch (error) {
                console.error('Error loading locale:', error);
            }
        }
    }

    static registerLocale(locale: string, loadFn: () => Promise<LocalizationFile>) {
        this.locales[locale] = loadFn;
        if (!this.i18n.global.availableLocales.includes(locale)) {
            this.i18n.global.availableLocales.push(locale);
        }
    }
}

export interface LocalizationFile {
    messages: Record<string, unknown>;
    /**
     * @default en-US
     */
    fallback?: string;
}

// Theres no way to use HMR accept on globs
function setupHmr() {
    if (import.meta.hot) {
        import.meta.hot.accept('./i18n/en-US.ts', (mod) => {
            const localeFile = mod?.default;
            if (!localeFile) return;

            LocaleManager.locales['en-US'] = async () => localeFile;
            LocaleManager.switchLocale(LocaleManager.activeLocale.value);
        });
        import.meta.hot.accept('./i18n/nl-NL.ts', (mod) => {
            const localeFile = mod?.default;
            if (!localeFile) return;

            LocaleManager.locales['nl-NL'] = async () => localeFile;
            LocaleManager.switchLocale(LocaleManager.activeLocale.value);
        });
    }
}
