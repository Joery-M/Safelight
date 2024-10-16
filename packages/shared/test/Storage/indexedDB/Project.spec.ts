import { IDBKeyRange, indexedDB } from 'fake-indexeddb';
import { expect, test } from 'vitest';
import { Storage } from '../../../src/base/Storage';
import SimpleProject from '../../../src/Project/SimpleProject';
import { IndexedDbStorageController } from '../../../src/Storage/LocalStorage/IndexedDbStorage';

window.indexedDB = indexedDB;
window.IDBKeyRange = IDBKeyRange;

test('List project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new SimpleProject();
    await storage.saveProject(project);

    const projects = await Storage.getProjects();

    expect(projects.some((p) => p.id == project.id)).toBeTruthy();
});

test('Retrieve project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new SimpleProject();
    await storage.saveProject(project);

    const loadedProject = await storage.loadProject(project.id);

    expect(loadedProject?.id).toEqual(project.id);
});

test('Update project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new SimpleProject();
    project.name.value = 'Name 1';

    await storage.saveProject(project);

    project.name.value = 'Name 2';

    Storage.setStorage(storage);

    const res = await project.Save();
    expect(res).toEqual('Success');

    const loadedProject = await storage.loadProject(project.id);
    expect(loadedProject).toBeDefined();
    expect(loadedProject?.name.value).toBe('Name 2');
});
