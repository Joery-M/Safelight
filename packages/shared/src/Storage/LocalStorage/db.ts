import Dexie, { type Table } from 'dexie';
import { IDBKeyRange, indexedDB } from 'fake-indexeddb';
import type { StoredMedia, StoredProject, StoredSimpleTimelineItem } from '../../base/Storage';

export class SafelightIndexedDB extends Dexie {
    media!: Table<StoredMedia, string>;
    project!: Table<StoredProject, string>;
    timelineItem!: Table<StoredSimpleTimelineItem, string>;

    constructor() {
        if (__TEST__) {
            super('SafelightIdb', { indexedDB, IDBKeyRange });
        } else {
            super('SafelightIdb');
        }

        this.version(1).stores({
            media: 'id, name, type',
            project: 'id, name',
            timelineItem: 'id'
        });
    }
}
