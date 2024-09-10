import { CustomInspectorState } from '@vue/devtools-api';
import { MaybeRefOrGetter, toValue } from '@vueuse/core';
import { computed, ref } from 'vue';
import { TimelineElement, TimelineElementRenderPayload, TimelineManager } from '..';
import { useSmoothNum } from '../tools/useSmoothNum';

export class TimelineCursorElement implements TimelineElement {
    name = 'Cursor';

    frameInterval = ref(1);

    public cursor = computed(
        () => Math.round(this.cursorPos.value / this.frameInterval.value) * this.frameInterval.value
    );
    /**
     * Cursor position in milliseconds
     */
    private cursorPos = ref(100);
    private cursorPosSmooth = useSmoothNum(this.cursor, {
        stepPerc: 0.7,
        snapOffset: computed(() => 1000 / this.frameInterval.value + 1)
    });
    /**
     * Millisecond position when cursor starts being dragged
     */
    private cursorStartPos = ref(0);
    /**
     * Ideal position in milliseconds
     */
    private idealPos = ref(0);
    private isDragging = ref(false);

    private isRendering = ref(true);

    init(manager: TimelineManager) {
        let cursorMoveXstart = 0;
        manager.events.on('mouseMove', ({ mouseData }) => {
            // Early exit when mouse cant even be in range
            if (mouseData.y > 10 && !this.isDragging.value) {
                manager.cursor.delete('cursor');
                return;
            }

            const mouseX = mouseData.x - manager.layerPaneWidth.value;

            if (this.isDragging.value) {
                const offset = manager.pxToMs(mouseX - cursorMoveXstart);
                this.idealPos.value = this.cursorStartPos.value + offset;

                this.cursorPos.value = Math.max(this.idealPos.value, manager.leftBoundary.value);
                manager.cursor.set('cursor', ['ew-resize', 100]);
                return;
            }

            if (
                Math.abs(mouseX - manager.msToPx(this.cursorPos.value, true)) <= 9.5 ||
                this.isDragging.value
            ) {
                manager.cursor.set('cursor', ['ew-resize', 10]);
            } else {
                manager.cursor.delete('cursor');
            }
        });
        manager.events.on('mouseDown', ({ mouseData }) => {
            if (!mouseData.isInsideCanvas) return;
            if (mouseData.y > 10) {
                manager.cursor.delete('cursor');
                return;
            }

            const mouseX = mouseData.x - manager.layerPaneWidth.value;

            this.moveCursor(manager.pxToMs(mouseX, true));

            if (Math.abs(mouseX - manager.msToPx(this.cursorPos.value, true)) <= 9.5) {
                cursorMoveXstart = mouseX;
                this.cursorStartPos.value = this.cursorPos.value;
                this.idealPos.value = this.cursorPos.value;
                this.isDragging.value = true;
                manager.cursor.set('cursor', ['ew-resize', 10]);
            }
        });
        manager.events.on('mouseUp', ({ mouseData }) => {
            if (this.isDragging.value) {
                this.isDragging.value = false;

                const mouseX =
                    mouseData.x - manager.layerPaneWidth.value + manager.viewportOffsetX.value;
                if (
                    Math.abs(mouseX - manager.msToPx(this.cursorPos.value)) > 9.5 &&
                    mouseData.y > 10
                ) {
                    manager.cursor.delete('cursor');
                }
            }
        });
    }

    render({ ctx, manager }: TimelineElementRenderPayload) {
        const offsetX = manager.msToPx(this.cursorPosSmooth.value, true, true) - 10;
        if (offsetX < manager.layerPaneWidth.value - 19) {
            this.isRendering.value = false;
            return;
        }
        this.isRendering.value = true;

        const viewportWidth = manager.canvasWidth.value;
        const viewportHeight = manager.canvasHeight.value;

        ctx.save();
        ctx.beginPath();
        ctx.rect(manager.layerPaneWidth.value, 0, viewportWidth, viewportHeight);
        ctx.clip();
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.translate(offsetX, 0);

        // Handle
        ctx.fillStyle = '#ff5555';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arcTo(0, 11, 9, 11, 11);
        ctx.lineTo(9, 11);
        ctx.lineTo(10, 11);
        ctx.arcTo(19, 11, 19, 0, 11);
        ctx.lineTo(19, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Vertical bar
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(9, 10);
        ctx.lineTo(9, viewportHeight);
        ctx.lineTo(10, viewportHeight);
        ctx.lineTo(10, 10);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // 3 little vertical bars in handle
        ctx.fillStyle = '#632022';
        ctx.beginPath();
        ctx.moveTo(6, 1);
        ctx.lineTo(6, 7);
        ctx.lineTo(7, 7);
        ctx.lineTo(7, 1);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(12, 1);
        ctx.lineTo(12, 7);
        ctx.lineTo(13, 7);
        ctx.lineTo(13, 1);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(9, 1);
        ctx.lineTo(9, 7);
        ctx.lineTo(10, 7);
        ctx.lineTo(10, 1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    devtoolsState = (): CustomInspectorState => {
        return {
            cursor: [
                {
                    key: 'dragging',
                    value: this.isDragging.value
                },
                {
                    key: 'Actual position',
                    value: this.cursor.value
                },
                {
                    key: 'Sub-position',
                    value: this.cursorPos.value
                },
                {
                    key: 'Drag start',
                    value: this.cursorStartPos.value
                },
                {
                    key: 'Ideal pos',
                    value: this.idealPos.value
                },
                {
                    key: 'rendering',
                    value: this.isRendering.value
                }
            ]
        };
    };

    public moveCursor(time: MaybeRefOrGetter<number>) {
        this.cursorPos.value = toValue(time);
    }
}
