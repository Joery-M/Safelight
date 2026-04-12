import type { TimelineProperties } from '.';
import {
    JsBrowserStorage,
    JsTimeline,
    JsTimelineItem,
    type JsMediaBin
} from './binding/sl_binding';
import type { Project } from './project';

export class Timeline {
    private inner: JsTimeline;

    get id(): string {
        return /* @__PURE__ */ this.inner.get_id();
    }

    constructor(
        binPath: string,
        properties: TimelineProperties,
        private project: Project,
        private storage: JsBrowserStorage,
        private bin: JsMediaBin
    ) {
        this.inner = JsTimeline.create(project.inner, storage, bin, binPath, properties);
    }

    // TODO: This could be way improved in the future by for example only getting timeline items on request using proxy objects
    getTimelineItems(): JsTimelineItem[] {
        return this.inner.get_timeline_items();
    }
    getTimelineItemsInRange(start: number, end: number): JsTimelineItem[];
    getTimelineItemsInRange(
        start: number,
        end: number,
        layerStart: number,
        layerEnd: number
    ): JsTimelineItem[];
    getTimelineItemsInRange(
        start: number,
        end: number,
        layerStart?: number,
        layerEnd?: number
    ): JsTimelineItem[] {
        return this.inner.get_timeline_items_in_range(start, end, layerStart, layerEnd);
    }

    addTimelineItem(item: JsTimelineItem): void {
        this.inner.add_timeline_item(item);
    }

    deleteTimelineItem(item: JsTimelineItem): void {
        this.inner.add_timeline_item(item);
    }
}
