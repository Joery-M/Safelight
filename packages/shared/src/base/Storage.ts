import type Media from '@/Media/Media';
import type { MediaInfoType } from 'mediainfo.js';
import { Subject, type Observable } from 'rxjs';
import type IndexedDbStorageController from '../Storage/IndexDbStorage';
import type BaseProject from './Project';
import type { ProjectType } from './Project';
import type BaseTimeline from './Timeline';
import type { TimelineItemType } from './TimelineItem';

export default abstract class BaseStorageController {
    public abstract type: StorageControllerType;
    public version: string = '0.0.0';

    StopSaveProject = new Subject<void>();
    abstract SaveProject(project: BaseProject): SaveObservable;
    abstract LoadProject(projectId: string): Promise<BaseProject | undefined>;

    StopSaveMedia = new Subject<void>();
    abstract SaveMedia(media: StoredMedia): SaveObservable;
    abstract LoadMedia(mediaId: string): Promise<Media | undefined>;
    abstract GetMediaFromHash(id: string): Promise<Media | undefined>;

    abstract SaveTimeline(timeline: BaseTimeline): SaveObservable;
    abstract LoadTimeline(timelineId: string): Promise<BaseTimeline | undefined>;

    isIndexDBstorage = (): this is IndexedDbStorageController => this.type == 'IndexedDB';
    // TODO
    // isWebFileSystem = (): this is IndexedDbStorageController => this.type == 'WebFileSystem';
}

// Singleton pattern
export class Storage {
    private static currentStorageController: BaseStorageController;

    static setStorage(storageController: BaseStorageController) {
        if (!this.currentStorageController) {
            this.currentStorageController = storageController;
        } else {
            throw new Error('Storage controller already defined');
        }
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
export type SaveResults = 'Success' | 'Cancelled' | (string & {});

export type SaveObservable = Observable<{
    status: 'Waiting' | 'Success' | 'Error' | 'Cancelled';
    data?: any;
}>;

export interface StoredMedia {
    id: string;
    name: string;
    contentHash: string;
    fileInfo?: MediaInfoType;
    previewImage?: Blob;
    data: Blob;
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
}

export interface StoredTimeline {
    id: string;
    items: string[];
}
// TODO Add all necessary properties
export interface StoredTimelineItem {
    id: string;
    type: TimelineItemType;
    /**
     * The ID of a stored media item.
     *
     * Media has to be included in the stored project's media list to be used.
     */
    media?: string;
    start?: number;
    duration?: number;
}
