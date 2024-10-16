import { DateTime } from 'luxon';
import * as opfsTools from 'opfs-tools';
import type BaseProject from '../../base/Project';
import type {
    FilePath,
    FilePathTypes,
    SaveResults,
    StoredMedia,
    StoredProject
} from '../../base/Storage';
import BaseStorageController from '../../base/Storage';
import {
    ChunkedMediaFileItem,
    type ChunkedMediaFileItemMetadata
} from '../../Media/ChunkedMediaFile';
import { MediaItem } from '../../Media/Media';
import { MediaFileItem, type MediaFileItemMetadata } from '../../Media/MediaFile';
import SimpleProject from '../../Project/SimpleProject';
import { Timeline, type TimelineConfig } from '../../Timeline/Timeline';
import { NotificationService } from '../../UI/Notifications/NotificationService';
import { SafelightIndexedDB } from './db';

export class IndexedDbStorageController extends BaseStorageController {
    public version = '0.0.1';

    private db = new SafelightIndexedDB();

    async saveProject(project: BaseProject, includeTimelines = true): Promise<SaveResults> {
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
                const proms = project.timelines.map((timeline) => this.saveMedia(timeline));
                await Promise.allSettled(proms);
            }

            return 'Success';
        } catch (error: any) {
            return error.toString();
        }
    }
    async loadProject(projectId: string): Promise<BaseProject | undefined> {
        return this.db.project
            .get(projectId)
            .then<SimpleProject | undefined, never>(async (project) => {
                if (!project) return;

                if (project.type == 'Simple') {
                    const proj = new SimpleProject();
                    proj.id = project.id;
                    const mediaFetches = project.media.map(async (m) => {
                        const media = await this.loadMedia(m).catch((reason) => {
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
    async updateStoredProject(
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

    async saveMedia(media: MediaItem | StoredMedia): Promise<SaveResults> {
        this.checkPersistentStorage();

        const storedMedia: StoredMedia =
            'getMetadata' in media
                ? {
                      name: media.name,
                      id: media.id,
                      created: media.getMetadata('media.created'),
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
    async loadMedia<M extends MediaItem>(mediaId: string): Promise<M | undefined> {
        const storedMedia = await this.db.media.get({ id: mediaId });
        return this.mapStoredMediaToMediaItem(storedMedia) as unknown as M;
    }
    deleteMedia(mediaId: MediaItem): Promise<SaveResults>;
    deleteMedia(mediaId: StoredMedia): Promise<SaveResults>;
    deleteMedia(mediaId: string): Promise<SaveResults>;
    async deleteMedia(mediaId: MediaItem | StoredMedia | string): Promise<SaveResults> {
        const id = typeof mediaId === 'string' ? mediaId : mediaId?.id;
        if (!id) {
            console.error('Could not get media ID for deletion');
            return 'Error';
        }

        const media = await this.db.media.get(id);
        if (!media) {
            console.error('Could not find media for deletion');
            return 'Error';
        }
        // File path might not exist
        const filePath = media?.metadata?.file?.location as FilePath | undefined;
        try {
            if (filePath) {
                const file = opfsTools.file(filePath.join('/'));
                if (file && (await file.exists())) {
                    await file.remove();
                }
            }
        } catch (error) {
            console.error('Error deleting file from OPFS', error);
        }

        await this.db.media.delete(id);
        return 'Success';
    }

    async getAllMedia(projectId?: string) {
        if (projectId) {
            const mediaList = await this.db.project.get(projectId).then((p) => p?.media);
            if (!mediaList) {
                return [];
            }

            const storedMedias = await this.db.media
                .filter((m) => mediaList.includes(m.id))
                .toArray();

            return storedMedias
                .map((storedMedia) => this.mapStoredMediaToMediaItem(storedMedia))
                .filter((m) => !!m);
        } else {
            const storedMedias = await this.db.media.filter((m) => m.type !== 'Timeline').toArray();
            return storedMedias
                .map((storedMedia) => this.mapStoredMediaToMediaItem(storedMedia))
                .filter((m) => !!m);
        }
    }

    private mapStoredMediaToMediaItem(storedMedia?: StoredMedia) {
        switch (storedMedia?.type) {
            case 'ChunkedMediaFile': {
                const item = new ChunkedMediaFileItem(
                    storedMedia.metadata as ChunkedMediaFileItemMetadata
                );
                item.id = storedMedia.id;
                item.name = storedMedia.name;

                return item;
            }
            case 'MediaFile': {
                const item = new MediaFileItem(storedMedia.metadata as MediaFileItemMetadata);
                item.id = storedMedia.id;
                item.name = storedMedia.name;

                return item;
            }
            case 'Timeline': {
                const config = storedMedia.metadata.get('timelineConfig') as TimelineConfig;
                if (!config) {
                    return;
                }

                const item = new Timeline(config);
                for (const [path, value] of Object.entries(storedMedia.metadata)) {
                    item.addMetadata(path as any, value);
                }
                item.id = storedMedia.id;
                item.name = storedMedia.name;

                return item;
            }

            default:
                return;
        }
    }

    getBaseFilePath(type: FilePathTypes) {
        switch (type) {
            case 'media-files':
                return ['media', 'files'];
            case 'thumbnails':
                return ['media', 'thumbnails'];
            default:
                return ['misc'];
        }
    }

    async readFile(filePath: string[], start = 0, size?: number): Promise<ArrayBuffer | undefined> {
        const file = opfsTools.file(filePath.join('/'), 'r');
        const reader = await file.createReader();

        if (size === undefined) {
            size = (await reader.getSize()) - start;
        }
        return reader.read(size, { at: start });
    }

    async writeFile(filePath: FilePath, data: ArrayBuffer, start?: number) {
        if (start) {
            const file = opfsTools.file('/' + filePath.join('/'), 'rw-unsafe');
            const writer = await file.createWriter();
            await writer.write(data, { at: start });
            await writer.flush();
            await writer.close();
        } else {
            await opfsTools.write('/' + filePath.join('/'), data, { overwrite: true });
        }
    }

    async writeStream(filePath: FilePath, data: ReadableStream) {
        await opfsTools.write('/' + filePath.join('/'), data, { overwrite: true });
    }

    async DeleteFile(filePath: string[]) {
        const file = opfsTools.file(filePath.join('/'));
        await file.remove();
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
