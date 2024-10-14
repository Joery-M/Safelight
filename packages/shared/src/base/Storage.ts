import type { ChunkedMediaFileItem } from '../Media/ChunkedMediaFile';
import type { MediaItem, MediaItemTypes } from '../Media/Media';
import type { MediaFileItem } from '../Media/MediaFile';
import type { default as BaseProject, ProjectType } from './Project';
import type { TimelineItemType } from './TimelineItem';

export default abstract class BaseStorageController {
    public version: string = '0.0.0';

    abstract saveProject(project: BaseProject): Promise<SaveResults>;
    abstract loadProject(projectId: string): Promise<BaseProject | undefined>;
    abstract updateStoredProject(
        project: Partial<StoredProject> & Pick<StoredProject, 'id'>
    ): Promise<SaveResults>;
    static getProjects: () => Promise<StoredProject[]>;

    abstract saveMedia(media: StoredMedia): Promise<SaveResults>;
    abstract saveMedia(media: MediaItem): Promise<SaveResults>;
    abstract loadMedia<M extends MediaItem>(mediaId: string): Promise<M | undefined>;
    abstract getAllMedia(): Promise<(ChunkedMediaFileItem | MediaFileItem)[]>;

    abstract getBaseFilePath(type: FilePathTypes): FilePath;
    abstract writeFile(filePath: FilePath, data: ArrayBufferLike, start?: number): Promise<void>;
    abstract writeStream(filePath: FilePath, data: ReadableStream): Promise<void>;
    abstract readFile(
        filePath: FilePath,
        start?: number,
        size?: number
    ): Promise<ArrayBuffer | undefined>;
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
    type: ProjectType;
    /**
     * Array of media id's
     */
    media: string[];
    created: string;
    updated: string;
    metadata: { [key: string | number]: any };
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
