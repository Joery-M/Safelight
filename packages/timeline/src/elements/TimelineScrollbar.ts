import { CustomInspectorState } from '@vue/devtools-api';
import { useClamp } from '@vueuse/math';
import { computed, ref } from 'vue';
import { TimelineElement } from '..';

export class TimelineScrollbar implements TimelineElement {
    name = 'Scrollbar';

    private startPx = ref(0);
    private endPx = ref(0);
    private viewportHeight = ref(0);
    private mouseX = ref(0);
    private mouseY = ref(0);
    private opacity = computed(() => {
        const x1 = useClamp(this.mouseX.value, this.startPx.value, this.endPx.value).value;
        const y1 = this.viewportHeight.value - 5;

        const x2 = this.mouseX.value;
        const y2 = this.mouseY.value;

        const a = x1 - x2;
        const b = y1 - y2;

        return Math.floor(Math.min(2 / Math.sqrt(a * a + b * b), 1) * 100);
    });

    init: TimelineElement['init'] = (manager) => {
        manager.events.on('mouseMove', ({ mouseData }) => {
            this.mouseX.value = mouseData.x - manager.layerPaneWidth.value;
            this.mouseY.value = mouseData.y;
        });
    };

    render: TimelineElement['render'] = ({ ctx, manager }) => {
        const start = manager.viewportSmooth.start.value;
        const end = manager.viewportSmooth.end.value;
        const max = manager._maxWidth.value + manager.rightPadding.value;

        const viewportWidth =
            ctx.canvas.width / manager.windowDPI.value - manager.layerPaneWidth.value;
        this.viewportHeight.value = ctx.canvas.height / manager.windowDPI.value;
        ctx.save();
        ctx.translate(manager.layerPaneWidth.value, 0);
        ctx.strokeStyle = `rgba(84, 84, 84, ${this.opacity.value})`;

        ctx.beginPath();
        this.startPx.value = range(manager.leftBoundary.value, max, 0, viewportWidth, start);
        this.endPx.value = range(manager.leftBoundary.value, max, 0, viewportWidth, end);

        ctx.moveTo(this.startPx.value, this.viewportHeight.value - 5);
        ctx.lineTo(this.endPx.value, this.viewportHeight.value - 5);
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    };

    devtoolsState?: (() => CustomInspectorState) | undefined = () => {
        return {
            opacity: [
                {
                    key: 'mouse',
                    value: this.mouseX.value
                },
                {
                    key: 'opacity',
                    value: this.opacity.value
                }
            ]
        };
    };
}

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
    lerp(x2, y2, invlerp(x1, y1, a));
