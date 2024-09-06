import {
    computed,
    ComputedRef,
    MaybeRefOrGetter,
    ref,
    shallowReactive,
    ShallowRef,
    toValue
} from 'vue';
import { TimelineElement } from '..';

export class TimelineGrid implements TimelineElement {
    name = 'Grid';
    renderStep?: 'before' | 'after' | undefined = 'before';

    public steps = shallowReactive<GridStep[]>([]);
    /**
     * The highest opacity to use when rendering steps
     *
     * All other steps will be decreasingly opaque
     */
    public baseOpacity = ref(0.5);
    private stepsSorted = computed(() =>
        this.steps.sort((a, b) => toValue(a.interval) - toValue(b.interval))
    );
    render: TimelineElement['render'] = ({ ctx, manager }) => {
        for (let i = 0; i < this.stepsSorted.value.length; i++) {
            const step = this.stepsSorted.value[i];

            const intervalMs = toValue(step.interval);
            const fadeStart = toValue(step.fadeStart) ?? 10;
            const fadeEnd = toValue(step.fadeEnd) ?? 60;

            const intervalPx = manager.msToPx(intervalMs);

            const opacity = range(
                fadeStart,
                fadeEnd,
                0,
                this.baseOpacity.value / this.stepsSorted.value.length,
                intervalPx
            );

            ctx.fillStyle = `white`;
            if (opacity > 0) {
                const viewportWidth = ctx.canvas.width / manager.windowDPI.value;
                const viewportHeight = ctx.canvas.height / manager.windowDPI.value;

                ctx.save();
                ctx.beginPath();
                ctx.rect(manager.layerPaneWidth.value, 0, viewportWidth, viewportHeight);
                ctx.clip();

                ctx.globalAlpha = opacity;
                // 1 extra for at the start, another extra for at the end
                for (let curX = 0; curX < Math.ceil(viewportWidth / intervalPx) + 2; curX++) {
                    const loopedOffset = manager._offsetX.value % intervalPx;
                    const lineOffset = curX * intervalPx;

                    const x = manager.layerPaneWidth.value + (lineOffset - loopedOffset) - 1.5;
                    ctx.fillRect(x, 0, 1.5, viewportHeight);
                }
                ctx.restore();
            }
        }
    };
}

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
    lerp(x2, y2, invlerp(x1, y1, a));

export interface GridStep {
    /**
     * How often the line is rendered
     */
    interval: MaybeRefOrGetter<number> | ComputedRef<number> | ShallowRef<number>;
    /**
     * How wide the interval has to be (in pixels) to start fading in
     */
    fadeStart?: MaybeRefOrGetter<number> | ComputedRef<number> | ShallowRef<number>;
    /**
     * How wide the interval has to be (in pixels) to finish fading in
     */
    fadeEnd?: MaybeRefOrGetter<number> | ComputedRef<number> | ShallowRef<number>;
}
