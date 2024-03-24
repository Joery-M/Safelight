export namespace Timeline {
    export interface Timeline {
        moveTo(time: number): void;
        zoomIn(): void;
        zoomOut(): void;
        setZoom(zoom: number): void;
        focusItems(...id: string[]): void;
        focusAll(): void;
        selectItem(id: string): void;
        deselectItem(id: string): void;
        deselectAll(): void;
        addItem(item: TimelineItem): void;
    }

    export interface TimelineItem {
        id: string;
        name: string;
        color?: string;
        start: number;
        duration: number;
        layer: number;

        /**
         * Move timeline item relative to its current position.
         *
         * @param time The time in milliseconds to move the item by.
         */
        move(time: number): void;
        /**
         * Move timeline item to a specific time.
         *
         * @param time The time in milliseconds to move the item to.
         */
        moveTo(time: number): void;
    }
}
