export function showTimeline(canvas: HTMLCanvasElement) {
    canvas.style.maxWidth = 'calc(100vw - (100vw - 100%))';
    document.body.appendChild(canvas);
}
