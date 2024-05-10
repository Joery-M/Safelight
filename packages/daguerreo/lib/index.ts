import type Effect from '@safelight/shared/Rendering/Effect';
import type { SimpleTimelineConfig } from '@safelight/shared/Timeline/SimpleTimeline';

export class Daguerreo {
    private currentItems = new Set<DgItem>();
    private timelineConfig!: SimpleTimelineConfig;

    public reset() {
        this.currentItems.clear();
    }

    public setTimelineConfig(config: SimpleTimelineConfig) {
        this.timelineConfig = config;
    }

    public addItem(item: DgItem) {
        if (!this.timelineConfig) throw new Error('Timeline config has not been set');

        this.currentItems.add(item);
        item.effects.forEach((e) => {
            if (e.initialize)
                e.initialize({
                    timeline: this.timelineConfig,
                    timestamp: 0,
                    properties: e.properties.value
                });
            e.properties.value = e.propertySchema.value.cast(e.properties.value);
        });
    }

    private async renderItem(item: DgItem, time: number, post = false) {
        for (const effect of item.effects) {
            if (!post) {
                if (effect.renderer.render) {
                    await effect.renderer.render(item.source, {
                        timeline: this.timelineConfig,
                        timestamp: time,
                        properties: effect.properties.value
                    });
                }
            } else if (effect.renderer.postRender) {
                await effect.renderer.postRender(item.source, {
                    timeline: this.timelineConfig,
                    timestamp: time,
                    properties: effect.properties.value
                });
            }
        }
    }

    private async renderFrame(time: number) {
        for (const item of this.currentItems) {
            await this.renderItem(item, time);
        }
    }
}

interface DgItem {
    layer: number;
    source: OffscreenCanvasRenderingContext2D;
    effects: Effect[];
}
