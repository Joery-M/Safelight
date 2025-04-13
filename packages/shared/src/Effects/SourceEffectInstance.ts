import { v4 as uuidv4 } from 'uuid';
import { reactive } from 'vue';
import type { StoredSource } from '../base/Storage';
import type { TimelineItem } from '../Timeline/TimelineItem';
import type { SLSourceEffect } from './sourceEffect';
import type { SLComputedProperties, SLEffectProperties } from './transformEffect';

export class SourceEffectInstance<Properties extends SLEffectProperties = SLEffectProperties> {
    // Only for lists, not used in storage
    id = uuidv4();

    constructor(
        private item: TimelineItem,
        public source: SLSourceEffect,
        /**
         * Keyframes per millisecond
         */
        public keyframes = reactive(new Map<number, Map<string, any>>())
    ) {}

    setKeyframe(time: number, propertyName: string, value: any) {
        const existingKeysAtTime = this.keyframes.get(time);

        if (!existingKeysAtTime) {
            this.keyframes.set(time, new Map<string, any>([[propertyName, value]]));
        } else {
            existingKeysAtTime.set(propertyName, value);
        }
        this.item.save();
    }

    deleteKeyframe(time: number, propertyName: string) {
        const existingKeysAtTime = this.keyframes.get(time);
        if (existingKeysAtTime) existingKeysAtTime.delete(propertyName);
        this.item.save();
    }

    calculatePropertyValue(time: number, propertyName: string) {
        if (!this.source.properties) return;
        let value = this.source.properties[propertyName]?.default;
        const timeRecords = [...this.keyframes.entries()].sort(([a], [b]) => a - b);

        // Step through the sorted times
        for (const [kTime, keyframe] of timeRecords) {
            // Break when the time is more than the desired time
            if (kTime > time) break;

            // For each property, set the current value to the most recent value
            if (keyframe.has(propertyName)) {
                value = keyframe.get(propertyName)!;
            }
        }
        return value;
    }

    calculatePropertyValues(time: number) {
        if (!this.source.properties) return;

        // Set default values
        const keyframes = Object.fromEntries(
            Object.entries(this.source.properties).map(([k, v]) => [k, v.default])
        );

        const timeRecords = [...this.keyframes.entries()].sort(([a], [b]) => a - b);

        // Step through the sorted times
        for (const [kTime, keyframe] of timeRecords) {
            // Break when the time is more than the desired time
            if (kTime > time) break;

            // For each property, set the current value to the most recent value
            for (const [property, value] of keyframe.entries()) {
                keyframes[property] = value;
            }
        }

        return keyframes as SLComputedProperties<Properties>;
    }

    serialize = (): StoredSource => {
        // Looks fucky wucky, is not
        const keyframes = Object.fromEntries(
            Array.from(this.keyframes.entries()).map(([k, v]) => [
                k,
                Object.fromEntries(v.entries())
            ])
        );

        // More data can be added here in the future
        return {
            effectId: this.source.name,
            keyframes
        };
    };
}
