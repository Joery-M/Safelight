import type { FileInfo } from 'ffprobe-wasm';
import { Subject, type Observable } from 'rxjs';
import type IndexedDbStorageController from '../Storage/IndexDbStorage';
import type { ProjectType } from './Project';
import type { TimelineItemType } from './TimelineItem';

export default abstract class BaseStorageController {
    public abstract type: StorageControllerType;
    public version: string = '0.0.0';

    StopSaveProject = new Subject<void>();
    abstract SaveProject(project: StoredProject): SaveObservable;
    abstract LoadProject(projectId: string): Promise<StoredProject>;

    StopSaveMedia = new Subject<void>();
    abstract SaveMedia(media: StoredMedia): SaveObservable;
    abstract LoadMedia(mediaId: string): Promise<StoredMedia>;

    isIndexDBstorage = (): this is IndexedDbStorageController => this.type == 'IndexedDB';
    isWebFileSystem = (): this is IndexedDbStorageController => this.type == 'WebFileSystem';
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
    fileInfo?: FileInfo;
    previewImage?: Blob;
    data: Blob;
}

export interface StoredProject {
    id: string;
    name: string;
    type: ProjectType;
    media: Pick<StoredMedia, 'id'>[];
    timelines: Pick<StoredTimeline, 'id'>[];
}

// TODO
export interface StoredTimeline {
    id: string;
    items: Pick<StoredTimelineItem, 'id'>[];
}
export interface StoredTimelineItem {
    id: string;
    type: TimelineItemType;
    /**
     * The ID of a stored media item.
     *
     * Media has to be a part of the project to be used.
     */
    media?: Pick<StoredMedia, 'id'>;
    start?: number;
    duration?: number;
}
