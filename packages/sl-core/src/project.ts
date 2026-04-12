import { JsBrowserStorage, JsMediaBin, JsProject, JsTimeline } from './binding/sl_binding';

export class Project {
    /** @private This should only be used internally for JS > RS calls */
    inner: JsProject;
    private bin: JsMediaBin;
    private storage: JsBrowserStorage;

    get id(): string {
        return /* @__PURE__ */ this.inner.get_id();
    }

    constructor() {
        this.inner = new JsProject();
        this.bin = new JsMediaBin();
        this.storage = new JsBrowserStorage();
    }

    getTimeline(path: string): JsTimeline {
        return this.inner.get_timeline(this.storage, path);
    }

    async uploadFile(file: Blob, binPath: string): Promise<void> {
        return await this.inner.upload_file(this.storage, this.bin, file, binPath);
    }
}
