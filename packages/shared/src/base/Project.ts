import { Subject } from 'rxjs';
import { isReactive, isRef, ref, type ComputedRef, type Ref, type ShallowReactive } from 'vue';
import { type MediaItem } from '../Media/Media';
import type SimpleProject from '../Project/SimpleProject';
import type { Timeline } from '../Timeline/Timeline';
import type { SaveResults } from './Storage';

export default abstract class BaseProject {
    public abstract id: string;
    public name = ref('Untitled');
    public type: ProjectType = 'Base';

    public abstract media: ShallowReactive<MediaItem[]>;

    public abstract selectedTimeline: Ref<string | undefined>;
    public abstract timelines: ShallowReactive<Timeline[]>;
    public abstract timeline: ComputedRef<Timeline | undefined>;

    /**
     * Triggered when this class has been changed
     */
    public onDeepChange = new Subject<void>();

    public destroy$ = new Subject<void>();

    isBaseProject = (): this is BaseProject => this.type == 'Base';
    isSimpleProject = (): this is SimpleProject => this.type == 'Simple';

    hasFeature(feature: ProjectFeatures.saving): this is this & ProjectFeatureSaving;
    hasFeature(feature: ProjectFeatures.media): this is this & ProjectFeatureMedia;
    hasFeature(feature: ProjectFeatures) {
        switch (feature) {
            case ProjectFeatures.saving:
                return (
                    'Save' in this &&
                    typeof this.Save === 'function' &&
                    'isSaving' in this &&
                    isRef(this.isSaving)
                );
            case ProjectFeatures.media:
                return (
                    'usesMedia' in this &&
                    typeof this.usesMedia === 'function' &&
                    'media' in this &&
                    isReactive(this.media)
                );

            default:
                return false;
        }
    }
}

export type ProjectType = 'Base' | 'Simple';

export enum ProjectFeatures {
    saving,
    media
}

export interface ProjectFeatureSaving {
    isSaving: Ref<boolean>;
    Save(): Promise<SaveResults>;
}
export interface ProjectFeatureMedia {
    media: ShallowReactive<MediaItem[]>;
    usesMedia(media: MediaItem): boolean;
    loadFile(file: File): Promise<boolean>;
}
