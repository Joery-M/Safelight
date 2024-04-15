import { IDBKeyRange, indexedDB } from 'fake-indexeddb';
import { expect, test } from 'vitest';
import SimpleProject from '../../../src/Project/SimpleProject';
import IndexedDbStorageController from '../../../src/Storage/IndexedDbStorage';

test('List projects', async () => {
    global.indexedDB = indexedDB;
    global.IDBKeyRange = IDBKeyRange;

    const storage = new IndexedDbStorageController();

    const project = new SimpleProject();
    await storage.SaveProject(project);

    const projects = await storage.getProjects();

    expect(projects[0].id).toBe(project.id);
});

test('Retrieve project', async () => {
    global.indexedDB = indexedDB;
    global.IDBKeyRange = IDBKeyRange;

    const storage = new IndexedDbStorageController();

    const project = new SimpleProject();
    await storage.SaveProject(project);

    const loadedProject = await storage.LoadProject(project.id);

    expect(loadedProject?.id).toEqual(project.id);
});
