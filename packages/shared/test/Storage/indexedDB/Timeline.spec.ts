import { v4 as uuidv4 } from 'uuid';
import { beforeAll, expect, test } from 'vitest';
import { ChunkedMediaFileItem } from '../../../src/Media/ChunkedMediaFile';
import { MediaFileItem } from '../../../src/Media/MediaFile';
import { IndexedDbStorageController } from '../../../src/Storage/LocalStorage/IndexedDbStorage';
import { Timeline } from '../../../src/Timeline/Timeline';
import { Storage } from '../../../src/base/Storage';

beforeAll(() => {
    const storage = new IndexedDbStorageController();
    Storage.setStorage(storage);
});

const timelineId = uuidv4();

test('Save timeline with items', async () => {
    const timeline = new Timeline({ name: 'Main', framerate: 60, height: 1080, width: 1920 });
    timeline.id = timelineId;

    // Save timeline
    const tlSaveRes = await timeline.save();
    expect(tlSaveRes).toBe(true);

    expect(timeline.items.size).toBe(0);

    const item = await timeline.createTimelineItem();
    expect(timeline.items.size).toBe(1);

    const saveRes = await item.save();
    expect(saveRes).toBe(true);
});

test('Load timeline with items', async () => {
    const timeline = await Storage.getStorage().loadMedia<Timeline>(timelineId);

    expect(timeline).toBeDefined();
    expect(timeline).toBeInstanceOf(Timeline);
    expect(timeline).not.toBeInstanceOf(MediaFileItem);
    expect(timeline).not.toBeInstanceOf(ChunkedMediaFileItem);

    expect(timeline?.items.size).toBe(1);
});

test('Move timeline item', async () => {
    const timeline = await Storage.getStorage().loadMedia<Timeline>(timelineId);

    expect(timeline).toBeDefined();
    expect(timeline).toBeInstanceOf(Timeline);
    expect(timeline).not.toBeInstanceOf(MediaFileItem);
    expect(timeline).not.toBeInstanceOf(ChunkedMediaFileItem);

    expect(timeline?.items.size).toBe(1);

    const timelineItem = Array.from(timeline!.items.values())[0];

    expect(timelineItem.start.value).toBe(0);
    expect(timelineItem.end.value).toBe(1000);

    timelineItem.start.value = 1000;
    timelineItem.end.value = 2000;

    expect(timelineItem.start.value).toBe(1000);
    expect(timelineItem.end.value).toBe(2000);

    const saveRes = await timelineItem.save();
    expect(saveRes).toBe(true);
});

test('Test moved items', async () => {
    const timeline = await Storage.getStorage().loadMedia<Timeline>(timelineId);

    expect(timeline).toBeDefined();
    expect(timeline).toBeInstanceOf(Timeline);
    expect(timeline).not.toBeInstanceOf(MediaFileItem);
    expect(timeline).not.toBeInstanceOf(ChunkedMediaFileItem);

    expect(timeline?.items.size).toBe(1);

    const timelineItem = Array.from(timeline!.items.values())[0];

    expect(timelineItem.start.value).toBe(1000);
    expect(timelineItem.end.value).toBe(2000);
});

test('Delete timeline with items', async () => {
    const timeline = await Storage.getStorage().loadMedia<Timeline>(timelineId);

    expect(timeline).toBeDefined();
    expect(timeline).toBeInstanceOf(Timeline);
    expect(timeline).not.toBeInstanceOf(MediaFileItem);
    expect(timeline).not.toBeInstanceOf(ChunkedMediaFileItem);

    expect(timeline?.items.size).toBe(1);

    const timelineItemId = Array.from(timeline!.items.keys())[0];

    expect(timelineItemId).toBeDefined();
    expect(timelineItemId).toBeTypeOf('string');

    const result = await Storage.getStorage().deleteMedia(timeline!.id);

    expect(result).toBe('Success');
});
