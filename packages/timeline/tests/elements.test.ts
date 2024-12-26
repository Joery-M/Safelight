import { expect, test, vi } from 'vitest';
import { createTimelineManager } from '../src/';
import { TimelineLayer } from '../src/elements/TimelineLayer';
import { VideoTimelineElement } from '../src/elements/VideoTimelineElement';
import { TimelineCursorElement } from '../src/elements/TimelineCursorElement';
import { showTimeline } from './helpers';

test('Create manager', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const manager = createTimelineManager(canvas);
    expect(manager).toBeDefined();

    showTimeline(canvas);
});

test('Create layer', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const manager = createTimelineManager(canvas);
    expect(manager).toBeDefined();

    const layer = new TimelineLayer();
    expect(layer).toBeDefined();
    manager.addLayer(layer);

    expect(Array.from(manager.manager.layers)).toHaveLength(1);
    expect(manager.manager.layersSorted.value).toHaveLength(1);

    showTimeline(canvas);
});

test('Create layer and item', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const manager = createTimelineManager(canvas);
    expect(manager).toBeDefined();

    const layer = new TimelineLayer();
    expect(layer).toBeDefined();
    manager.addLayer(layer);

    const item = new VideoTimelineElement();
    expect(item).toBeDefined();
    item.layer.value = 0;
    manager.addLayerItem(item);

    expect(Array.from(layer.elements.value)).toHaveLength(1);
    expect(Array.from(manager.manager.layers)).toHaveLength(1);
    expect(Array.from(manager.manager.allLayerItems)).toHaveLength(1);
    expect(manager.manager.layersSorted.value).toHaveLength(1);

    showTimeline(canvas);
});

test('Create element', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const manager = createTimelineManager(canvas);
    expect(manager).toBeDefined();

    const cursor = new TimelineCursorElement();
    expect(cursor).toBeDefined();
    const renderCall = vi.spyOn(cursor, 'render');
    manager.addElement(cursor);

    manager.manager.renderAll();

    expect(renderCall).toBeCalledTimes(1);
    expect(Array.from(manager.manager.timelineElements)).toHaveLength(1);

    showTimeline(canvas);
});
