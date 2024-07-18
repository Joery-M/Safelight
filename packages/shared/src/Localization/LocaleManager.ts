import { reactive, ref } from 'vue';
import { type I18n } from 'vue-i18n';

export class LocaleManager {
    public static activeLocale = ref('en-US');

    public static locales = reactive<{ [locale: string]: () => Promise<Record<string, unknown>> }>(
        {}
    );

    private static i18n: I18n<{}, {}, {}, string, false>;

    static init(i18n: I18n<{}, {}, {}, string, false>) {
        this.i18n = i18n;

        const globImport = import.meta.glob<Record<string, unknown>>('./i18n/*.json');
        Object.entries(globImport).forEach(([path, fn]) => {
            this.registerLocale(path.split('/')[2].split('.')[0]!, fn);
        });
        const activeLocale = this.activeLocale.value;
        this.loadLocale(activeLocale).then((messages) => {
            this.i18n.global.setLocaleMessage(activeLocale, messages as any);
        });
    }

    static async switchLocale(locale: string) {
        const messages = await this.loadLocale(locale);
        if (messages) {
            this.i18n.global.setLocaleMessage(locale, messages as any);
            this.i18n.global.locale.value = locale;
            this.activeLocale.value = locale;

            document.querySelector('html')?.setAttribute('lang', locale);
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

    static registerLocale(locale: string, loadFn: () => Promise<Record<string, unknown>>) {
        this.locales[locale] = loadFn;
        this.i18n.global.availableLocales.push(locale);
    }
}
