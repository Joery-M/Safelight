import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import Timeline from '../src/Timeline.vue';

test('Component initializes', () => {
    expect(Timeline).toBeTruthy();

    const wrapper = mount(Timeline);

    expect(wrapper.text()).toEqual('Timeline works just fine');
});
