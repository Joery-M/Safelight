import { CustomInspectorState } from '@vue/devtools-api';
import { computed, ref } from 'vue';
import { TimelineElement } from '..';
import { useSmoothNum } from '../tools/useSmoothNum';

export class TimelineScrollbarHoriz implements TimelineElement {
    name = 'Horizontal scrollbar';

    protected startPx = ref(0);
    protected endPx = ref(0);
    protected scrollbarHidden = ref(true);
    protected lineThickness = ref(5);
    protected opacity = useSmoothNum(
        computed(() => (this.scrollbarHidden.value ? 0 : 1)),
        { stepPerc: 0.3 }
    );

    init: TimelineElement['init'] = (manager) => {
        let hiddenTimer: ReturnType<typeof setTimeout>;

        const resetHiddenTimer = () => {
            clearTimeout(hiddenTimer);
            this.scrollbarHidden.value = false;
            hiddenTimer = setTimeout(() => {
                this.scrollbarHidden.value = true;
            }, 2500);
        };

        manager.events.on('mouseMove', () => {
            if (!manager.pointerOut.value) {
                resetHiddenTimer();
            } else {
                clearTimeout(hiddenTimer);
                hiddenTimer = setTimeout(() => {
                    this.scrollbarHidden.value = true;
                }, 500);
            }
        });

        manager.events.on('pan', () => {
            resetHiddenTimer();
        });
    };

    render: TimelineElement['render'] = ({ ctx, manager }) => {
        const start = manager.viewportSmooth.start.value;
        const end = manager.viewportSmooth.end.value;
        const max = manager._maxWidth.value + manager.rightPadding.value;

        const viewportWidth =
            ctx.canvas.width / manager.windowDPI.value - manager.layerPaneWidth.value;
        const viewportHeight = ctx.canvas.height / manager.windowDPI.value;
        ctx.save();
        ctx.translate(manager.layerPaneWidth.value, 0);
        ctx.strokeStyle = `rgba(84, 84, 84, ${this.opacity.value})`;

        ctx.beginPath();
        this.startPx.value = range(manager.leftBoundary.value, max, 0, viewportWidth, start);
        this.endPx.value = range(manager.leftBoundary.value, max, 0, viewportWidth, end);

        ctx.moveTo(
            this.startPx.value + this.lineThickness.value / 2,
            viewportHeight - this.lineThickness.value
        );
        ctx.lineTo(
            this.endPx.value - this.lineThickness.value / 2,
            viewportHeight - this.lineThickness.value
        );
        ctx.lineWidth = this.lineThickness.value;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    };

    devtoolsState?: (() => CustomInspectorState) | undefined = () => {
        return {
            opacity: [
                {
                    key: 'is hidden',
                    value: this.scrollbarHidden.value
                },
                {
                    key: 'opacity',
                    value: this.opacity.value
                }
            ],
            position: [
                {
                    key: 'start',
                    value: this.startPx.value
                },
                {
                    key: 'end',
                    value: this.endPx.value
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
