import type { SetRequired } from 'type-fest';
import type { ChunkedMediaFileItem } from '../Media/ChunkedMediaFile';
import type { MediaItem, MediaItemTypes } from '../Media/Media';
import type { MediaFileItem } from '../Media/MediaFile';
import type { Project } from '../Project/Project';
import type { Timeline } from '../Timeline/Timeline';
import type { TimelineItem } from '../Timeline/TimelineItem';

export default abstract class BaseStorageController {
    public version: string = '0.0.0';

    abstract saveProject(project: Project): Promise<SaveResults>;
    abstract loadProject(projectId: string): Promise<Project | undefined>;
    abstract deleteProject(projectId: string): Promise<SaveResults>;
    abstract patchStoredProject(
        project: SetRequired<Partial<StoredProject>, 'id'>
    ): Promise<SaveResults>;
    static getProjects: () => Promise<StoredProject[]>;

    abstract saveMedia(media: MediaItem<any>): Promise<SaveResults>;
    abstract loadMedia<M extends MediaItem>(mediaId: string): Promise<M | undefined>;
    abstract deleteMedia(mediaId: MediaItem): Promise<SaveResults>;
    abstract deleteMedia(mediaId: StoredMedia): Promise<SaveResults>;
    abstract deleteMedia(mediaId: string): Promise<SaveResults>;
    abstract getAllMedia(
        projectId?: string
    ): Promise<(ChunkedMediaFileItem | MediaFileItem | Timeline)[]>;

    abstract getBaseFilePath(type: FilePathTypes): FilePath;
    abstract writeFile(filePath: FilePath, data: ArrayBufferLike, start?: number): Promise<void>;
    abstract writeStream(filePath: FilePath, data: ReadableStream): Promise<void>;
    abstract readFile(
        filePath: FilePath,
        start?: number,
        size?: number
    ): Promise<ArrayBuffer | undefined>;
    abstract deleteFile(filePath: FilePath): Promise<void>;

    abstract saveTimelineItem(item: TimelineItem): Promise<SaveResults>;
    abstract loadTimelineItem(
        itemId: string,
        timeline: Timeline
    ): Promise<TimelineItem | undefined>;
    abstract deleteTimelineItem(itemId: string): Promise<SaveResults>;
}

export class Storage {
    public static async getProjects(): Promise<StoredProject[]> {
        const storageControllers = [
            (await import('../Storage/LocalStorage/IndexedDbStorage')).IndexedDbStorageController
        ];

        const getPromises = storageControllers.map((controller) => controller.getProjects());

        const results = await Promise.all(getPromises);

        return results.flat(1);
    }

    // Singleton pattern
    private static currentStorageController: BaseStorageController;

    static hasStorage() {
        return this.currentStorageController !== undefined;
    }
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
export type FilePathTypes = 'media-files' | 'thumbnails' | (string & {});

export type FilePath = (string | number)[];

export interface ProjectFileTreeItem {
    name: string;
    /**
     * The ID of a Media item.
     *
     * This ID should also exist in {@link StoredProject.media|`StoredProject.media`}
     */
    mediaID: string;
}
export interface ProjectFileTreeDirectory {
    name: string;
    entries: ProjectFileTree;
}

export interface ProjectFileTree {
    [path: string]: ProjectFileTreeItem | ProjectFileTreeDirectory;
}

export interface StoredMedia {
    id: string;
    name: string;
    created: string;
    type: MediaItemTypes;
    metadata: { [key: string | number]: any };
}

export interface StoredProject {
    id: string;
    name: string;
    /**
     * Array of media id's
     */
    media: string[];
    created: string;
    updated: string;
    fileTree: ProjectFileTree;
    metadata: { [key: string | number]: any };
}

export interface StoredTimelineItem {
    id: string;
    name: string;
    start: number;
    end: number;
    layer: number;
    effects: StoredEffect[];
}

// TODO Add all necessary properties
export interface StoredEffect {
    id: string;
}
