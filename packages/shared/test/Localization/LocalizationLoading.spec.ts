import { parse } from 'path';
import { expect, test } from 'vitest';
import { createI18n } from 'vue-i18n';
import { LocaleManager } from '../../src/Localization/LocaleManager';

test('Initialize manager', async (ctx) => {
    const i18n = createI18n<false>({
        locale: 'en-US',
        legacy: false,
        fallbackLocale: 'en-US',
        messages: {}
    });
    await LocaleManager.init(i18n);

    ctx.onTestFinished(() => {
        i18n.dispose();
    });
});

test('Loading locales', async (ctx) => {
    const i18n = createI18n<false>({
        locale: 'en-US',
        legacy: false,
        fallbackLocale: 'en-US',
        messages: {}
    });
    await LocaleManager.init(i18n);

    const locales = Object.keys(import.meta.glob('../../src/Localization/i18n/*.json')).map(
        (file) => parse(file).name
    );

    expect(LocaleManager.locales).keys(locales);
    expect(LocaleManager.activeLocale.value).toBe('en-US');

    ctx.onTestFinished(() => {
        i18n.dispose();
    });
});
