import Dexie, { type Table } from 'dexie';
import type { StoredMedia, StoredProject } from '../base/Storage';

export class SafelightIndexedDB extends Dexie {
    media!: Table<StoredMedia, string>;
    project!: Table<StoredProject, string>;

    constructor() {
        // Only during tests
        if (global?.vitest) {
            super('SafelightIdb', { indexedDB: global.indexedDB, IDBKeyRange: global.IDBKeyRange });
        } else {
            super('SafelightIdb');
        }

        this.version(1).stores({
            media: 'id, name, contentHash',
            project: 'id, name, type'
        });
    }
}
