export namespace Player {
    export interface Player {
        play(): void;
        pause(): void;
        seek(time: number): void;

        framerate: number;

        currentTime: number;
        duration: number;
        playing: boolean;
    }
}
