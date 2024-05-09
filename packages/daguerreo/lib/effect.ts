export class Effect {
    constructor(
        public name: string,
        private handler: (ctx: OffscreenCanvasRenderingContext2D) => void
    ) {}

    render(ctx: OffscreenCanvasRenderingContext2D) {
        this.handler(ctx);
    }
}
