import { expect, test } from 'vitest';
import Timeline, { TimelineItem } from '../src/index';

test('Index exports', () => {
    expect(Timeline).toBeDefined();
    expect(TimelineItem).toBeDefined();
});
