import type { MediaInfoType } from 'mediainfo.js';
import type {
    default as Media,
    MediaType,
    AudioTrackInfo,
    ImageInfo,
    TextTrackInfo,
    VideoTrackInfo
} from '../Media/Media';
import type IndexedDbStorageController from '../Storage/IndexedDbStorage';
import type { default as BaseProject, ProjectType } from './Project';
import type BaseTimeline from './Timeline';
import type { TimelineItemType } from './TimelineItem';

export default abstract class BaseStorageController {
    public abstract type: StorageControllerType;
    public version: string = '0.0.0';

    abstract SaveProject(project: BaseProject): Promise<SaveResults>;
    abstract LoadProject(projectId: string): Promise<BaseProject | undefined>;

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
