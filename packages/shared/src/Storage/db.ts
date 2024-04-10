import Dexie, { type Table } from 'dexie';
import type { StoredMedia, StoredProject } from '../base/Storage';

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
