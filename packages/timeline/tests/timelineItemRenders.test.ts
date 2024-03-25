import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import { Timeline } from '..';

test('Timeline item renders', () => {
    expect(Timeline).toBeTruthy();

    const wrapper = mount(Timeline, {
        props: {
            items: {
                '1': {
                    id: '1',
                    name: 'Test',
                    start: 100,
                    duration: 500,
                    layer: 0
                }
            }
        }
    });

    const item = wrapper.element.querySelector('.timelineItem');
    expect(item).toBeDefined();
});

test('Multiple timeline items renders', () => {
    expect(Timeline).toBeTruthy();

    const wrapper = mount(Timeline, {
        props: {
            items: {
                '1': {
                    id: '1',
                    name: 'Test 1',
                    start: 100,
                    duration: 500,
                    layer: 0
                },
                '2': {
                    id: '2',
                    name: 'Test 2',
                    start: 300,
                    duration: 200,
                    layer: 1
                },
                '3': {
                    id: '3',
                    name: 'Test 3',
                    start: 100,
                    duration: 500,
                    layer: 2
                }
            }
        }
    });

    const item = wrapper.element.querySelectorAll<HTMLDivElement>('.timelineItem');
    expect(item).toHaveLength(3);
    expect(item[0].style.top).toBe('-32px');
    expect(item[1].style.top).toBe('-64px');
    expect(item[2].style.top).toBe('-96px');
});
