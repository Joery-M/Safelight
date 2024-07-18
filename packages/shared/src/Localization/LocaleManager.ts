import { watchImmediate } from '@vueuse/shared';
import { ref } from 'vue';
import { type I18n } from 'vue-i18n';

export class LocaleManager {
    public static activeLocale = ref('en-US');

    public static locales: { [locale: string]: () => Promise<Record<string, unknown>> } = {};

    private static i18n: I18n<{}, {}, {}, string, false>;

    static init(i18n: I18n<{}, {}, {}, string, false>) {
        this.i18n = i18n;
        const globImport = import.meta.glob<Record<string, unknown>>('./i18n/*.json');
        const importsFixed = Object.entries(globImport).map(([path, promise]) => {
            const nameRegex = /(?<=\/)([A-z0-9-]*)(?=\.json)/;
            return [nameRegex.exec(path)?.[0] ?? path, promise];
        });
        this.locales = {
            ...this.locales,
            ...Object.fromEntries(importsFixed)
        };
        watchImmediate(i18n.global.locale, (locale) => {
            console.log(locale);
            this.loadLocale(locale);
        });
    }

    static switchLocale(locale: string) {
        this.i18n.global.locale.value = locale;

        document.querySelector('html')?.setAttribute('lang', locale);
    }

    static async loadLocale(locale: string): Promise<boolean> {
        if (!(locale in this.locales)) {
            console.error(`Locale ${locale} not found in registered locales`);
            return false;
        } else {
            const messages = await this.locales[locale]();
            this.i18n.global.setLocaleMessage(locale, messages as any);
            return true;
        }
    }
}
