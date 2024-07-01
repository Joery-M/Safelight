import { expect, test } from 'vitest';
import { SettingsManager } from '../../src/Settings/SettingsManager';

test('Assigning namespaces', () => {
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

test('Getting namespaces', () => {
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

    expect(SettingsManager.getNamespace('test')).toBeDefined();
    expect(SettingsManager.getNamespace('test').title).toBe('Test');
    expect(SettingsManager.getNamespace('test').settings).toHaveLength(1);
});
