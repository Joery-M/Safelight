import type IndexedDbStorageController from '../Storage/IndexDbStorage';
import type BaseProject from './Project';

export default abstract class BaseStorageController {
    public abstract type: StorageControllerType;
    public version: string = '0.0.0';

    abstract Save(project: BaseProject): Promise<SaveResults> | SaveResults;

    abstract Load(projectId: string): Promise<BaseProject | string> | (BaseProject | string);

    isIndexDBstorage = (): this is IndexedDbStorageController => this.type == 'IndexedDB';
}

export type StorageControllerType = 'IndexedDB';
export type SaveResults = 'Success' | 'Cancelled' | (string & {});
