/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseProject from '@/base/Project';
import Media from '@/Media/Media';
import SimpleProject from '@/Project/SimpleProject';
import { from, Observable, Subject, takeUntil } from 'rxjs';
import type {
    SaveObservable,
    StorageControllerType,
    StoredMedia,
    StoredProject
} from '../base/Storage';
import BaseStorageController from '../base/Storage';
import { SafelightIndexedDB } from './db';
import type BaseTimeline from '@/base/Timeline';
import type SimpleTimeline from '@/Timeline/SimpleTimeline';

export default class IndexedDbStorageController extends BaseStorageController {
    public type: StorageControllerType = 'IndexedDB';
    public version = '0.0.1';

    private db = new SafelightIndexedDB();

    SaveProject(project: BaseProject): SaveObservable {
        this.StopSaveProject = new Subject();
        return new Observable((subscriber) => {
            const storableProject: StoredProject = {
                id: project.id,
                name: project.name,
                type: project.type,
                media: project.media.map((m) => m.id.value).filter((id) => id !== undefined),
                timelines: project.timelines.map((m) => m.id)
            };
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

            from(this.db.project.put(storableProject, project.id))
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
    async LoadProject(projectId: string): Promise<BaseProject | undefined> {
        return this.db.project
            .get(projectId)
            .then<SimpleProject | undefined, never>(async (project) => {
                if (!project) return;

                if (project.type == 'Simple') {
                    const proj = new SimpleProject();
                    proj.id = project.id;
                    const mediaFetches = project.media.map((m) => this.LoadMedia(m));
                    const timelineFetches = project.timelines.map((t) =>
                        this.LoadTimeline<SimpleTimeline>(t)
                    );
                    proj.media.push(
                        ...(await Promise.all(mediaFetches)).filter((m) => m !== undefined)
                    );
                    proj.timelines.push(
                        ...(await Promise.all(timelineFetches)).filter((t) => t !== undefined)
                    );
                    proj.name = project.name;
                    return proj;
                } else {
                    return;
                }
            });
    }

    SaveMedia(media: StoredMedia): SaveObservable {
        throw new Error('Method not implemented.');
    }
    LoadMedia(mediaId: string): Promise<Media | undefined> {
        throw new Error('Method not implemented.');
    }
    async GetMediaFromHash(hash: string): Promise<Media | undefined> {
        const m = await this.db.media.get({
            contentHash: hash
        });
        const media = new Media(m?.id)
        return ;
    }

    SaveTimeline(timeline: BaseTimeline): SaveObservable {
        throw new Error('Method not implemented.');
    }
    LoadTimeline<Timeline extends BaseTimeline = BaseTimeline>(
        timelineId: string
    ): Promise<Timeline | undefined> {
        throw new Error('Method not implemented.');
    }
}
