import { DateTime } from 'luxon';
import * as opfsTools from 'opfs-tools';
import type BaseProject from '../../base/Project';
import type { FilePathTypes, SaveResults, StoredMedia, StoredProject } from '../../base/Storage';
import BaseStorageController from '../../base/Storage';
import { ChunkedMediaFileItem } from '../../Media/ChunkedMediaFile';
import { MediaItem } from '../../Media/Media';
import { MediaFileItem } from '../../Media/MediaFile';
import SimpleProject from '../../Project/SimpleProject';
import { Timeline, type TimelineConfig } from '../../Timeline/Timeline';
import { NotificationService } from '../../UI/Notifications/NotificationService';
import { SafelightIndexedDB } from './db';

export class IndexedDbStorageController extends BaseStorageController {
    public version = '0.0.1';

    private db = new SafelightIndexedDB();

    async SaveProject(project: BaseProject, includeTimelines = true): Promise<SaveResults> {
        this.checkPersistentStorage();
        const existingProject = await this.db.project.get({ id: project.id });

        const storableProject: StoredProject = {
            id: project.id,
            name: project.name.value,
            type: project.type,
            media: project.media
                .map((m) => m.id)
                .filter((id) => id !== undefined)
                .concat(...project.timelines.map((m) => m.id)),
            updated: DateTime.now().toISO(),
            created: existingProject?.created ?? DateTime.now().toISO(),
            metadata: new Map()
        };

        try {
            await this.db.project.put(storableProject, project.id);

            if (includeTimelines) {
                const proms = project.timelines.map((timeline) => this.SaveMedia(timeline));
                await Promise.allSettled(proms);
            }

            return 'Success';
        } catch (error: any) {
            return error.toString();
        }
    }
    async LoadProject(projectId: string): Promise<BaseProject | undefined> {
        return this.db.project
            .get(projectId)
            .then<SimpleProject | undefined, never>(async (project) => {
                if (!project) return;

                if (project.type == 'Simple') {
                    const proj = new SimpleProject();
                    proj.id = project.id;
                    const mediaFetches = project.media.map(async (m) => {
                        const media = await this.LoadMedia(m).catch((reason) => {
                            console.error('Error loading media into project', reason);
                        });
                        if (media) {
                            // Timelines are seperate
                            if (media.isTimeline()) {
                                proj.timelines.push(media);
                                // if (media.id == project.activeTimeline) {
                                //     proj.selectTimeline(timeline);
                                // }
                            } else {
                                proj.media.push(media);
                            }
                        } else {
                            // TODO: Add a way for media to be marked as missing
                        }
                    });

                    // Load all media
                    await Promise.allSettled(mediaFetches);
                    proj.name.value = project.name;
                    return proj;
                } else {
                    return;
                }
            });
    }
    async UpdateStoredProject(
        project: Partial<StoredProject> & Pick<StoredProject, 'id'>
    ): Promise<SaveResults> {
        this.checkPersistentStorage();
        const existingProject = await this.db.project.get({ id: project.id });

        // Remove created so it can't be overridden
        const { created, ...restProject } = project;

        const storableProject: StoredProject = {
            ...existingProject,
            ...(restProject as StoredProject),
            updated: DateTime.now().toISO()
        };

        try {
            await this.db.project.put(storableProject, project.id);
            return 'Success';
        } catch (error: any) {
            return error.toString();
        }
    }
    static getProjects(): Promise<StoredProject[]> {
        return new Promise(async (resolve) => {
            const db = new SafelightIndexedDB();
            await db.open();
            resolve(db.project.toArray());
            db.close();
        });
    }

    async SaveMedia(media: MediaItem | StoredMedia): Promise<SaveResults> {
        this.checkPersistentStorage();

        const storedMedia: StoredMedia =
            'getMetadata' in media
                ? {
                      name: media.name,
                      id: media.id,
                      created: (await media.getMetadata('media'))!.created,
                      metadata: await media.serializeMetadata(),
                      type: media.type
                  }
                : media;

        try {
            await this.db.media.put(storedMedia);
            return 'Success';
        } catch (error) {
            console.error(error);
            return 'Error';
        }
    }
    async LoadMedia<M extends MediaItem>(mediaId: string): Promise<M | undefined> {
        const storedMedia = await this.db.media.get({ id: mediaId });

        switch (storedMedia?.type) {
            case 'ChunkedMediaFile': {
                const item = new ChunkedMediaFileItem();
                for (const [path, value] of storedMedia.metadata) {
                    item.addMetadata(path as any, value);
                }
                item.id = storedMedia.id;
                item.name = storedMedia.name;

                return item as unknown as M;
            }
            case 'MediaFile': {
                const item = new MediaFileItem();
                for (const [path, value] of storedMedia.metadata) {
                    item.addMetadata(path as any, value);
                }
                item.id = storedMedia.id;
                item.name = storedMedia.name;

                return item as unknown as M;
            }
            case 'Timeline': {
                const config = storedMedia.metadata.get('timelineConfig') as TimelineConfig;
                if (!config) {
                    return;
                }

                const item = new Timeline(config);
                for (const [path, value] of storedMedia.metadata) {
                    item.addMetadata(path as any, value);
                }
                item.id = storedMedia.id;
                item.name = storedMedia.name;

                return item as unknown as M;
            }

            default:
                return;
        }
    }

    GetBaseFilePath(type: FilePathTypes) {
        switch (type) {
            case 'media-files':
                return ['media', 'files'];
            case 'thumbnails':
                return ['media', 'thumbnails'];
            default:
                return ['misc'];
        }
    }

    async ReadFile(filePath: string[], start = 0, size?: number): Promise<ArrayBuffer | undefined> {
        const file = opfsTools.file(filePath.join('/'), 'r');
        const reader = await file.createReader();

        if (size === undefined) {
            size = (await reader.getSize()) - start;
        }
        return reader.read(size, { at: start });
    }

    async WriteFile(filePath: string[], data: ArrayBufferLike, start?: number) {
        const writer = await opfsTools.file(filePath.join('/'), 'rw').createWriter();

        const buff = Buffer.from(data);
        if (start) {
            writer.write(buff, { at: start });
        } else {
            writer.write(buff);
        }
    }

    private notificationShown = false;

    private checkPersistentStorage() {
        if (this.notificationShown || __TEST__) {
            return;
        }
        this.notificationShown = true;
        return new Promise<void>(async (resolve) => {
            const persisted = await navigator.storage.persisted();
            if (!persisted) {
                NotificationService.notify({
                    severity: 'warning',
                    title: 'storage.nonPersistentNotif.title',
                    text: 'storage.nonPersistentNotif.text',
                    buttons: [
                        {
                            label: 'storage.nonPersistentNotif.button',
                            type: 'filled',
                            onClick: async (_ev, notif) => {
                                await navigator.storage.persist();
                                NotificationService.close(notif);
                                resolve();
                            }
                        }
                    ],
                    onClose: () => {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}
