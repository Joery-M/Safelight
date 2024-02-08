import BaseProject from '../base/Project';
import type { SaveResults, StorageControllerType } from '../base/Storage';
import BaseStorageController from '../base/Storage';

export default class IndexedDbStorageController extends BaseStorageController {
    public type: StorageControllerType = 'IndexedDB';
    public version = '0.0.1';

    public async Save(timeline: BaseProject): Promise<SaveResults> {
        return 'Error';
    }
    public async Load(id: string): Promise<BaseProject | string> {
        return 'Not implemented';
    }
}
