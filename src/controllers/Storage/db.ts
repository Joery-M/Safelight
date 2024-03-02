import Dexie, { type Table } from 'dexie';
import type { FileInfo } from 'ffprobe-wasm';
import type { ProjectType } from '../base/Project';
import type { TimelineItemType } from '../base/TimelineItem';

export class SafelightIndexedDB extends Dexie {
    media!: Table<StoredMedia, string>;
    project!: Table<StoredProject, string>;

    constructor() {
        super('SafelightIdb');
        this.version(1).stores({
            media: 'id, name, contentHash',
            project: 'id, name, type'
        });
    }
}

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
    end?: number;
}

export const db = new SafelightIndexedDB();
