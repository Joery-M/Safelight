import Dexie, { type Table } from 'dexie';
import type { StoredMedia, StoredProject, StoredSimpleTimelineItem } from '../base/Storage';

export class SafelightIndexedDB extends Dexie {
    media!: Table<StoredMedia, string>;
    project!: Table<StoredProject, string>;
    timelineItem!: Table<StoredSimpleTimelineItem, string>;

    constructor() {
        if (__TEST__) {
            super('SafelightIdb', { indexedDB: window.indexedDB, IDBKeyRange: window.IDBKeyRange });
        } else {
            super('SafelightIdb');
        }

        this.version(1).stores({
            media: 'id, name',
            project: 'id, name',
            timelineItem: 'id'
        });
    }
}
