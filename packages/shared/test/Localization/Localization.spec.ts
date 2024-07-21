import { beforeEach, expect, test, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import { LocaleManager } from '../../src/Localization/LocaleManager';

beforeEach(async (ctx) => {
    const i18n = createI18n<false>({
        locale: 'en-US',
        legacy: false,
        fallbackLocale: 'en-US',
        messages: {}
    });
    LocaleManager.activeLocale.value = 'en-US';
    await LocaleManager.init(i18n);

    ctx.onTestFinished(() => {
        i18n.dispose();
    });
});

test('Switch locale', async () => {
    expect(LocaleManager.activeLocale.value).toBe('en-US');
    const curLocales = LocaleManager.i18n.global.messages.value;
    expect(curLocales).key('en-US');

    await LocaleManager.switchLocale('nl-NL');

    expect(LocaleManager.activeLocale.value).toBe('nl-NL');
    expect(curLocales).keys('nl-NL', 'en-US');
});

test('Import locale file', async () => {
    vi.mock('../../src/Localization/i18n/en-US.json', () => {
        return {
            default: {
                messages: {
                    test: '123'
                }
            }
        };
    });

    expect(LocaleManager.i18n.global.t('test')).toBe('123');
});

test('Add locale', async () => {
    const loadFn = vi.fn(async () => {
        return {
            messages: {
                test: '123'
            }
        };
    });

    LocaleManager.registerLocale('te-ST', {
        loadFn,
        localeName: 'Test'
    });

    await LocaleManager.switchLocale('te-ST');

    expect(LocaleManager.activeLocale.value).toBe('te-ST');
    expect(LocaleManager.i18n.global.t('test')).toBe('123');
    expect(loadFn).toBeCalledTimes(1);
});
