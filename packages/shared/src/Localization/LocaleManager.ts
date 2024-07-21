import { reactive, ref } from 'vue';
import { type I18n, type IntlDateTimeFormat } from 'vue-i18n';

/**
 * Locale names in their respective language
 */
const defaultLocaleNames = {
    'en-US': 'English',
    'nl-NL': 'Nederlands'
};

export class LocaleManager {
    public static activeLocale = ref('en-US');

    public static locales = reactive<{ [locale: string]: RegisteredLocale }>({});

    public static i18n: I18n<{}, {}, {}, string, false>;

    static async init(i18n: I18n<{}, {}, {}, string, false>) {
        this.i18n = i18n;
        for (const member in this.locales) delete this.locales[member];

        const globImport = import.meta.glob<LocalizationFile>('./i18n/*.json', {
            import: 'default'
        });
        Object.entries(globImport).forEach(([path, fn]) => {
            const localeName = path.split('/')[2].split('.')[0]!;

            this.registerLocale(localeName, {
                loadFn: fn,
                localeName:
                    defaultLocaleNames[localeName as keyof typeof defaultLocaleNames] ?? localeName
            });
        });

        // HMR for locale files
        if (import.meta.hot) {
            setupHmr();
        }

        await this.switchLocale(this.activeLocale.value);
    }

    static async switchLocale(locale: string) {
        const localeFile = await this.loadLocale(locale);
        if (!localeFile) return;

        this.i18n.global.setLocaleMessage(locale, localeFile.messages);
        if (localeFile.dateTimeFormat)
            this.i18n.global.setDateTimeFormat(locale, localeFile.dateTimeFormat);

        const fallbackLocale = localeFile.fallback ?? 'en-US';
        this.i18n.global.fallbackLocale.value = fallbackLocale;

        // Also load fallback asynchronously
        this.loadLocale(fallbackLocale).then((fallback) => {
            if (fallback) {
                this.i18n.global.setLocaleMessage(fallbackLocale, fallback.messages);
                if (fallback.dateTimeFormat)
                    this.i18n.global.setDateTimeFormat(fallbackLocale, fallback.dateTimeFormat);
            }
        });

        this.i18n.global.locale.value = locale;
        this.activeLocale.value = locale;

        document.documentElement.setAttribute('lang', locale);
    }

    private static async loadLocale(locale: string) {
        if (!(locale in this.locales)) {
            console.error(`Locale ${locale} not found in registered locales`);
        } else {
            try {
                const messages = await this.locales[locale].loadFn();
                return messages;
            } catch (error) {
                console.error('Error loading locale:', error);
            }
        }
    }

    static registerLocale(locale: string, desc: RegisteredLocale) {
        this.locales[locale] = desc;
        if (!this.i18n.global.availableLocales.includes(locale)) {
            this.i18n.global.availableLocales.push(locale);
        }
    }
}

interface RegisteredLocale {
    loadFn: () => Promise<LocalizationFile>;
    localeName: string;
}

export interface LocalizationFile {
    messages: Record<string, unknown>;
    dateTimeFormat?: {
        short: IntlDateTimeFormat[string];
        medium: IntlDateTimeFormat[string];
        long: IntlDateTimeFormat[string];
        dateTime: IntlDateTimeFormat[string];
        time: IntlDateTimeFormat[string];
        timeLong: IntlDateTimeFormat[string];
        timeFull: IntlDateTimeFormat[string];
    };
    /**
     * @default en-US
     */
    fallback?: string;
}

// Theres no way to use HMR accept on globs
function setupHmr() {
    if (import.meta.hot) {
        import.meta.hot.accept('./i18n/en-US.json', (mod) => {
            const localeFile = mod?.default;
            if (!localeFile) return;

            LocaleManager.locales['en-US'] = {
                loadFn: async () => localeFile,
                localeName: defaultLocaleNames['en-US']
            };
            LocaleManager.switchLocale(LocaleManager.activeLocale.value);
        });
        import.meta.hot.accept('./i18n/nl-NL.json', (mod) => {
            const localeFile = mod?.default;
            if (!localeFile) return;

            LocaleManager.locales['nl-NL'] = {
                loadFn: async () => localeFile,
                localeName: defaultLocaleNames['nl-NL']
            };
            LocaleManager.switchLocale(LocaleManager.activeLocale.value);
        });
    }
}
