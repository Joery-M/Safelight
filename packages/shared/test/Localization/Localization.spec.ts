import { expect, onTestFinished, test, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import { LocaleManager, type LocalizationFile } from '../../src/Localization/LocaleManager';

test('Switch locale', async () => {
    const i18n = createI18n<false>({
        locale: 'en-US',
        legacy: false,
        fallbackLocale: 'en-US',
        messages: {}
    });
    LocaleManager.activeLocale.value = 'en-US';
    await LocaleManager.init(i18n);

    expect(LocaleManager.activeLocale.value).toBe('en-US');
    const curLocales = LocaleManager.i18n.global.messages.value;
    expect(curLocales).key('en-US');

    await LocaleManager.switchLocale('nl-NL');

    expect(LocaleManager.activeLocale.value).toBe('nl-NL');
    expect(curLocales).keys('nl-NL', 'en-US');

    onTestFinished(() => {
        i18n.dispose();
    });
});

test('Import locale file', async () => {
    vi.mock('../../src/Localization/i18n/en-US.json', () => {
        return {
            default: {
                test: '123'
            }
        };
    });

    expect(LocaleManager.i18n.global.t('test')).toBe('123');
});

test('Add locale', async () => {
    const loadFn = vi.fn(async () => {
        return {
            test: '123'
        } as LocalizationFile;
    });

    const i18n = createI18n<false>({
        locale: 'en-US',
        legacy: false,
        fallbackLocale: 'en-US',
        messages: {}
    });
    await LocaleManager.init(i18n);

    LocaleManager.registerLocale('te-ST', {
        loadFn,
        localeName: 'Test'
    });

    await LocaleManager.switchLocale('te-ST');

    expect(LocaleManager.activeLocale.value).toBe('te-ST');
    expect(LocaleManager.i18n.global.t('test')).toBe('123');
    expect(loadFn).toBeCalledTimes(1);
});
