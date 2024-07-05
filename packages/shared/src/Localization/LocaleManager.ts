import { ref } from 'vue';
import { createI18n } from 'vue-i18n';

export class LocaleManager {
    public static readonly locales = ['en-US', 'nl-NL'];

    public static readonly i18n = createI18n({});

    public static activeLocale = ref('en-US');

    static switchLocale(locale: string) {
        if (this.i18n.mode === 'legacy') {
            this.i18n.global.locale = locale;
        } else {
            this.i18n.global.locale.value = locale;
        }

        document.querySelector('html')?.setAttribute('lang', locale);
    }
}
