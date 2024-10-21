import { expect, test } from 'vitest';
import { Storage } from '../../../src/base/Storage';
import { Project } from '../../../src/Project/Project';
import { IndexedDbStorageController } from '../../../src/Storage/LocalStorage/IndexedDbStorage';

test('List project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new Project();
    await storage.saveProject(project);

    const projects = await Storage.getProjects();

    expect(projects.some((p) => p.id == project.id)).toBeTruthy();
});

test('Retrieve project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new Project();
    await storage.saveProject(project);

    const loadedProject = await storage.loadProject(project.id);

    expect(loadedProject?.id).toEqual(project.id);
});

test('Update project', async () => {
    const storage = new IndexedDbStorageController();

    const project = new Project();
    project.name.value = 'Name 1';

    await storage.saveProject(project);

    project.name.value = 'Name 2';

    Storage.setStorage(storage);

    const res = await project.save();
    expect(res).toEqual('Success');

    const loadedProject = await storage.loadProject(project.id);
    expect(loadedProject).toBeDefined();
    expect(loadedProject?.name.value).toBe('Name 2');
});

test('Patch stored project', async () => {
    const storage = new IndexedDbStorageController();
    Storage.setStorage(storage);

    const project = new Project();
    project.name.value = 'Name 1';

    const saveRes = await project.save();
    expect(saveRes).toEqual('Success');

    const patchRes = await storage.patchStoredProject({
        id: project.id,
        name: 'Name 2'
    });
    expect(patchRes).toBe('Success');

    const loadedProject = await storage.loadProject(project.id);
    expect(loadedProject).toBeDefined();
    expect(loadedProject?.name.value).toBe('Name 2');
});
