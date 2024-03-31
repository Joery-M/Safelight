import type { StoredMedia, StoredProject } from '@/base/Storage';
import Dexie, { type Table } from 'dexie';

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
