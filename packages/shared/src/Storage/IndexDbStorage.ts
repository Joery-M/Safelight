/* eslint-disable @typescript-eslint/no-unused-vars */
import { from, Observable, Subject, takeUntil } from 'rxjs';
import type {
    SaveObservable,
    StorageControllerType,
    StoredMedia,
    StoredProject
} from '../base/Storage';
import BaseStorageController from '../base/Storage';
import { SafelightIndexedDB } from './db';

export default class IndexedDbStorageController extends BaseStorageController {
    public type: StorageControllerType = 'IndexedDB';
    public version = '0.0.1';

    private db = new SafelightIndexedDB();

    SaveProject(project: StoredProject): SaveObservable {
        this.StopSaveProject = new Subject();
        return new Observable((subscriber) => {
            subscriber.next({
                status: 'Waiting'
            });

            this.StopSaveProject.subscribe(() => {
                subscriber.next({
                    status: 'Cancelled'
                });
                subscriber.complete();
                this.StopSaveProject.complete();
            });

            from(this.db.project.put(project, project.id))
                .pipe(takeUntil(this.StopSaveProject))
                .subscribe(() => {
                    subscriber.next({
                        status: 'Success'
                    });
                    subscriber.complete();
                    this.StopSaveProject.complete();
                });
        });
    }
    async LoadProject(projectId: string): Promise<StoredProject> {
        return await this.db.project.get(projectId);
    }

    SaveMedia(media: StoredMedia): SaveObservable {
        throw new Error('Method not implemented.');
    }
    LoadMedia(mediaId: string): Promise<StoredMedia> {
        throw new Error('Method not implemented.');
    }
}
