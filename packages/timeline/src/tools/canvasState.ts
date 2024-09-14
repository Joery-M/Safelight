export function canvasSave(ctx: CanvasRenderingContext2D) {
    const {
        strokeStyle,
        fillStyle,
        globalAlpha,
        lineWidth,
        lineCap,
        lineJoin,
        miterLimit,
        lineDashOffset,
        shadowOffsetX,
        shadowOffsetY,
        shadowBlur,
        shadowColor,
        globalCompositeOperation,
        font,
        textAlign,
        textBaseline,
        direction,
        imageSmoothingEnabled
    } = ctx;
    const state = {
        strokeStyle,
        fillStyle,
        globalAlpha,
        lineWidth,
        lineCap,
        lineJoin,
        miterLimit,
        lineDashOffset,
        shadowOffsetX,
        shadowOffsetY,
        shadowBlur,
        shadowColor,
        globalCompositeOperation,
        font,
        textAlign,
        textBaseline,
        direction,
        imageSmoothingEnabled,
        transform: ctx.getTransform(),
        dashList: ctx.getLineDash()
    };
    return structuredClone(state);
}
export function canvasRestore(ctx: CanvasRenderingContext2D, state: ReturnType<typeof canvasSave>) {
    ctx.strokeStyle = state.strokeStyle;
    ctx.fillStyle = state.fillStyle;
    ctx.globalAlpha = state.globalAlpha;
    ctx.lineWidth = state.lineWidth;
    ctx.lineCap = state.lineCap;
    ctx.lineJoin = state.lineJoin;
    ctx.miterLimit = state.miterLimit;
    ctx.lineDashOffset = state.lineDashOffset;
    ctx.shadowOffsetX = state.shadowOffsetX;
    ctx.shadowOffsetY = state.shadowOffsetY;
    ctx.shadowBlur = state.shadowBlur;
    ctx.shadowColor = state.shadowColor;
    ctx.globalCompositeOperation = state.globalCompositeOperation;
    ctx.font = state.font;
    ctx.textAlign = state.textAlign;
    ctx.textBaseline = state.textBaseline;
    ctx.direction = state.direction;
    ctx.imageSmoothingEnabled = state.imageSmoothingEnabled;

    ctx.setTransform(state.transform);
    ctx.setLineDash(state.dashList);
}
