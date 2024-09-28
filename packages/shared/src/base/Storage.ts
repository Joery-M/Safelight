import type { MediaItem, MediaItemTypes } from '../Media/Media';
import type Timeline from '../Timeline/Timeline';
import type { default as BaseProject, ProjectType } from './Project';
import type { TimelineItem, TimelineItemType } from './TimelineItem';

export default abstract class BaseStorageController {
    public version: string = '0.0.0';

    abstract SaveProject(project: BaseProject): Promise<SaveResults>;
    abstract LoadProject(projectId: string): Promise<BaseProject | undefined>;
    abstract UpdateStoredProject(
        project: Partial<StoredProject> & Pick<StoredProject, 'id'>
    ): Promise<SaveResults>;
    static getProjects: () => Promise<StoredProject[]>;

    abstract SaveMedia(media: StoredMedia): Promise<SaveResults>;
    abstract SaveMedia(media: MediaItem): Promise<SaveResults>;
    abstract LoadMedia<M extends MediaItem>(mediaId: string): Promise<M | undefined>;

    abstract WriteFile(
        filePath: string[],
        data: ArrayBufferLike,
        start?: number
    ): Promise<ArrayBuffer | undefined>;
    abstract ReadFile(
        filePath: string[],
        start?: number,
        size?: number
    ): Promise<ArrayBuffer | undefined>;

    abstract SaveTimeline(timeline: TimelineItem): Promise<SaveResults>;
    abstract LoadTimeline(timelineId: string): Promise<Timeline | undefined>;
}

export class Storage {
    public static async getProjects(): Promise<StoredProject[]> {
        const storageControllers = [(await import('../Storage/IndexedDbStorage')).default];

        const getPromises = storageControllers.map((controller) => controller.getProjects());

        const results = await Promise.all(getPromises);

        return results.flat(1);
    }

    // Singleton pattern
    private static currentStorageController: BaseStorageController;

    static setStorage(storageController: BaseStorageController) {
        this.currentStorageController = storageController;
    }
    static getStorage() {
        if (this.currentStorageController) {
            return this.currentStorageController;
        } else {
            throw new Error('Storage controller has not been set');
        }
    }
}

export type SaveResults = 'Success' | 'Cancelled' | 'Error' | (string & {});

export interface StoredMedia {
    id: string;
    name: string;
    created: string;
    type: MediaItemTypes;
    metadata: Map<string, any>;
}

export interface StoredProject {
    id: string;
    name: string;
    type: ProjectType;
    /**
     * Array of media id's
     */
    media: string[];
    created: string;
    updated: string;
    metadata: Map<string, any>;
}

// TODO Add all necessary properties
export interface StoredSimpleTimelineItem {
    id: string;
    name: string;
    type: TimelineItemType;
    /**
     * The ID of a stored media item.
     *
     * Media has to be included in the stored project's media list to be used.
     */
    media?: string;
    start: number;
    end: number;
    layer: number;
    duration?: number;
}
