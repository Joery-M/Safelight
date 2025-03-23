import { ref, shallowReactive } from 'vue';
import { type I18n, type IntlDateTimeFormat, type DefineLocaleMessage } from 'vue-i18n';

/**
 * Locale names in their respective language
 */
const defaultLocaleNames: Record<string, string> = {
    'en-US': 'English',
    'nl-NL': 'Nederlands'
};

export class LocaleManager {
    public static activeLocale = ref('en-US');

    public static locales = shallowReactive(new Map<string, RegisteredLocale>());

    public static i18n: I18n<{}, {}, {}, string, false>;

    static async init(i18n: I18n<{}, {}, {}, string, false>) {
        this.i18n = i18n;
        for (const member in this.locales) this.locales.delete(member);

        const globImport = import.meta.glob<LocalizationFile>('./i18n/*.json', {
            import: 'default'
        });
        Object.entries(globImport).forEach(([path, fn]) => {
            const localeName = path.split('/')[2].split('.')[0]!;

            this.registerLocale(localeName, {
                loadFn: fn,
                localeName: defaultLocaleNames[localeName] ?? localeName
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

        const { localeSettings, ...messages } = localeFile;
        this.i18n.global.setLocaleMessage(locale, messages);
        if (localeSettings?.dateTimeFormat)
            this.i18n.global.setDateTimeFormat(locale, localeSettings.dateTimeFormat);

        const fallbackLocale = localeSettings?.fallback ?? 'en-US';
        this.i18n.global.fallbackLocale.value = fallbackLocale;

        // Also load fallback asynchronously
        this.loadLocale(fallbackLocale).then((fallback) => {
            if (fallback) {
                const { localeSettings, ...messages } = fallback;

                this.i18n.global.setLocaleMessage(fallbackLocale, messages);
                if (localeSettings?.dateTimeFormat)
                    this.i18n.global.setDateTimeFormat(
                        fallbackLocale,
                        localeSettings.dateTimeFormat
                    );
            }
        });

        this.i18n.global.locale.value = locale;
        this.activeLocale.value = locale;

        document.documentElement.setAttribute('lang', locale);
    }

    private static async loadLocale(locale: string) {
        if (!this.locales.has(locale)) {
            console.error(`Locale ${locale} not found in registered locales`);
        } else {
            try {
                const messages = await this.locales.get(locale)!.loadFn();
                return messages;
            } catch (error) {
                console.error('Error loading locale:', error);
            }
        }
    }

    static registerLocale(locale: string, desc: RegisteredLocale) {
        this.locales.set(locale, desc);
        if (!this.i18n.global.availableLocales.includes(locale)) {
            this.i18n.global.availableLocales.push(locale);
        }
    }
}

interface RegisteredLocale {
    loadFn: () => Promise<LocalizationFile>;
    localeName: string;
}

export type LocalizationFile = DefineLocaleMessage & {
    localeSettings?: {
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
    };
};

function setupHmr() {
    if (import.meta.hot) {
        import.meta.hot.accept({ glob: ['./i18n/*.json'] }, (mod) => {
            for (const [path, file] of Object.entries(mod)) {
                const localeFile = file?.default;
                if (!localeFile) continue;

                const locale = path.split('i18n/')[1].split('.json')[0];

                LocaleManager.registerLocale(locale, {
                    loadFn: async () => localeFile,
                    localeName: defaultLocaleNames[locale] ?? locale
                });
            }
            LocaleManager.switchLocale(LocaleManager.activeLocale.value);
        });
    }
}
