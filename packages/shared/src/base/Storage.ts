import type { MediaInfoType } from 'mediainfo.js';
import type {
    AudioTrackInfo,
    ImageInfo,
    default as Media,
    MediaType,
    TextTrackInfo,
    VideoTrackInfo
} from '../Media/Media';
import type IndexedDbStorageController from '../Storage/IndexedDbStorage';
import type { default as BaseProject, ProjectType } from './Project';
import type BaseTimeline from './Timeline';
import type { TimelineItemType } from './TimelineItem';
import type { TimelineType } from './Timeline';

export default abstract class BaseStorageController {
    public abstract type: StorageControllerType;
    public version: string = '0.0.0';

    abstract SaveProject(project: BaseProject): Promise<SaveResults>;
    abstract LoadProject(projectId: string): Promise<BaseProject | undefined>;
    abstract UpdateStoredProject(
        project: Partial<StoredProject> & Pick<StoredProject, 'id'>
    ): Promise<SaveResults>;
    static getProjects: () => Promise<StoredProject[]>;

    abstract SaveMedia(media: StoredMedia): Promise<SaveResults>;
    abstract SaveMedia(media: Media): Promise<SaveResults>;
    abstract LoadMedia(mediaId: string): Promise<Media | undefined>;
    abstract getMediaFromHash(hash: string): Promise<Media | undefined>;
    abstract hasMediaHash(hash: string): Promise<boolean>;

    abstract SaveTimeline(timeline: BaseTimeline): Promise<SaveResults>;
    abstract LoadTimeline(timelineId: string): Promise<BaseTimeline | undefined>;

    isIndexDBstorage = (): this is IndexedDbStorageController => this.type == 'IndexedDB';
    // TODO
    // isWebFileSystem = (): this is IndexedDbStorageController => this.type == 'WebFileSystem';
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

export type StorageControllerType = 'IndexedDB' | 'WebFileSystem';
export type SaveResults = 'Success' | 'Cancelled' | 'Error' | (string & {});

export interface StoredMedia {
    id: string;
    name: string;
    type: MediaType;
    contentHash: string;
    fileInfo?: MediaInfoType;
    previewImage?: Blob;
    data: Blob;
    duration: number;
    videoTracks: VideoTrackInfo[];
    audioTracks: AudioTrackInfo[];
    textTracks: TextTrackInfo[];
    imageInfo?: ImageInfo;
    created: string;
}

export interface StoredProject {
    id: string;
    name: string;
    type: ProjectType;
    /**
     * Array of media id's
     */
    media: string[];
    /**
     * Array of timeline id's
     */
    timelines: string[];
    activeTimeline?: string;
    created: string;
    updated: string;
}

export interface StoredSimpleTimeline {
    id: string;
    name: string;
    type: TimelineType;
    width: number;
    height: number;
    framerate: number;
    items: string[];
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
