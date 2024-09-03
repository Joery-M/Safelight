import { TimelineElementTypes, TimelineItemElement, TimelineManager } from '..';

export class VideoTimelineElement implements TimelineItemElement {
    type: TimelineElementTypes = 'layerItem';

    private manager!: TimelineManager;

    /* Start */
    private _start = 0;
    public get start() {
        return this._start;
    }
    public set start(value) {
        this._start = value;
        this.manager.requestExtraRender();
    }

    /* End */
    private _end = 0;
    public get end() {
        return this._end;
    }
    public set end(value) {
        this._end = value;
        this.manager.requestExtraRender();
    }

    /* Layer */
    private _layer = 0;
    public get layer() {
        return this._layer;
    }
    public set layer(value) {
        this._layer = value;
        this.manager.requestExtraRender();
    }

    init = (manager: TimelineManager) => {
        this.manager = manager;
    };

    render(ctx: CanvasRenderingContext2D) {
        console.log('render', this.end, this.layer);
        ctx.fillText(Date.now().toString(), 0, 0);
        ctx.fillStyle = '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, this.end, this.layer);
    }
}
