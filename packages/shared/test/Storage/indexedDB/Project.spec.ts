import { IDBKeyRange, indexedDB } from 'fake-indexeddb';
import { expect, test } from 'vitest';
import SimpleProject from '../../../src/Project/SimpleProject';
import IndexedDbStorageController from '../../../src/Storage/IndexedDbStorage';
import { Storage } from '../../../src/base/Storage';

window.indexedDB = indexedDB;
window.IDBKeyRange = IDBKeyRange;

test('List project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new SimpleProject();
    await storage.SaveProject(project);

    const projects = await Storage.getProjects();

    expect(projects.some((p) => p.id == project.id)).toBeTruthy();
});

test('Retrieve project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new SimpleProject();
    await storage.SaveProject(project);

    const loadedProject = await storage.LoadProject(project.id);

    expect(loadedProject?.id).toEqual(project.id);
});
