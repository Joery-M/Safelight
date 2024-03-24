import { Player } from './player';
import { Timeline } from './timeline';

declare global {
    namespace Safelight {
        export const player: Player.Player;
        export const timeline: Timeline.Timeline;

        export const plugin: Plugin;

        export function exports(): void;
    }
}

export interface Plugin {
    readonly name: string;
    readonly version: string;
}
