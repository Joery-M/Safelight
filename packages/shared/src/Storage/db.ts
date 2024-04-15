import Dexie, { type Table } from 'dexie';
import type { StoredMedia, StoredProject } from '../base/Storage';

export class SafelightIndexedDB extends Dexie {
    media!: Table<StoredMedia, string>;
    project!: Table<StoredProject, string>;

    constructor() {
        // Only during tests
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (window?.vitest) {
            super('SafelightIdb', { indexedDB: window.indexedDB, IDBKeyRange: window.IDBKeyRange });
        } else {
            super('SafelightIdb');
        }

        this.version(1).stores({
            media: 'id, name, contentHash',
            project: 'id, name, type'
        });
    }
}
