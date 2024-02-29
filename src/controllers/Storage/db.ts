import Dexie, { type Table } from 'dexie';
import type BaseProject from '../base/Project';
import type { ProjectType } from '../base/Project';

export class MySubClassedDexie extends Dexie {
    media!: Table<StoredMedia, string>;
    ProjectMedia!: Table<ProjectMediaTable, string>;

    constructor() {
        super('SafelightIdb');
        this.version(1).stores({
            ProjectMedia: 'id, mediaId, projectId',
            media: 'id, name, contentHash, data'
        });
    }
}

export interface StoredMedia {
    id: string;
    name: string;
    contentHash: string;
    data: ArrayBuffer;
}

interface ProjectMediaTable {
    id: string;
    mediaId: string;
    projectId: string;
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

export const db = new MySubClassedDexie();
