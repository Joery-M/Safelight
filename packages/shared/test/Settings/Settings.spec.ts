import { beforeEach, expect, test } from 'vitest';
import { SettingsManager } from '../../src/Settings/SettingsManager';

beforeEach(() => {
    localStorage.clear();
    SettingsManager.setup([
        {
            name: 'test',
            title: 'Test',
            settings: [
                {
                    type: 'boolean',
                    name: 'onOff',
                    title: 'Lightswitch',
                    default: false
                }
            ]
        }
    ]);
});

test('Getting setting', () => {
    const setting = SettingsManager.getSetting('test.onOff');

    expect(setting).toBeDefined();

    expect(setting.value).toBe(false);
});

test('Setting setting value', () => {
    SettingsManager.setSetting('test.onOff', true);

    const setting = SettingsManager.getSetting('test.onOff');

    expect(setting).toBeDefined();

    expect(setting.value).toBe(true);
});

test('Saving settings to localStorage', () => {
    SettingsManager.setSetting('test.onOff', true);

    const setting = SettingsManager.getSetting('test.onOff');

    expect(setting).toBeDefined();

    expect(setting.value).toBe(true);

    SettingsManager.saveSettings();
    // Get value from localstorage
    const storedVal = JSON.parse(localStorage.getItem('sl-settings'));
    expect(storedVal).toMatchObject({
        test: {
            onOff: true
        }
    });
});
test('Loading from localStorage', () => {
    localStorage.setItem(
        'sl-settings',
        JSON.stringify({
            test: {
                onOff: true
            }
        })
    );
    SettingsManager.loadSettings();
    const setting = SettingsManager.getSetting('test.onOff');
    expect(setting.value).toBe(true);
});
