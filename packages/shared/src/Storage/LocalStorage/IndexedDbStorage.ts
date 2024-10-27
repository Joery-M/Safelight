import { toValue } from '@vueuse/core';
import { DateTime } from 'luxon';
import * as opfsTools from 'opfs-tools';
import type { SetRequired } from 'type-fest';
import type {
    FilePath,
    FilePathTypes,
    SaveResults,
    StoredMedia,
    StoredProject,
    StoredTimelineItem
} from '../../base/Storage';
import BaseStorageController from '../../base/Storage';
import {
    ChunkedMediaFileItem,
    type ChunkedMediaFileItemMetadata
} from '../../Media/ChunkedMediaFile';
import { MediaItem } from '../../Media/Media';
import { MediaFileItem, type MediaFileItemMetadata } from '../../Media/MediaFile';
import { Project } from '../../Project/Project';
import { Timeline, type TimelineItemMetadata } from '../../Timeline/Timeline';
import { NotificationService } from '../../UI/Notifications/NotificationService';
import { SafelightIndexedDB } from './db';

export class IndexedDbStorageController extends BaseStorageController {
    public version = '0.0.1';

    private db = new SafelightIndexedDB();

    async saveProject(project: Project, includeTimelines = true): Promise<SaveResults> {
        this.checkPersistentStorage();
        const existingProject = await this.db.project.get({ id: project.id });

        const storableProject: StoredProject = {
            id: project.id,
            name: project.name.source ?? '',
            media: Array.from(project.media.keys()),
            updated: DateTime.now().toISO(),
            created: existingProject?.created ?? DateTime.now().toISO(),
            fileTree: project.serializeFileTree(),
            metadata: {}
        };

        try {
            await this.db.project.put(storableProject, project.id);

            if (includeTimelines) {
                for (const media of project.media.values()) {
                    if (media.isTimeline()) {
                        await this.saveMedia(media);
                    }
                }
            }

            return 'Success';
        } catch (error: any) {
            return error.toString();
        }
    }
    async loadProject(projectId: string): Promise<Project | undefined> {
        const storedProject = await this.db.project.get(projectId);
        if (!storedProject) return;

        const project = new Project();

        project.id = storedProject.id;
        project.name.value = storedProject.name;
        // TODO: Find what to do with metadata

        for (const mediaId of storedProject.media) {
            const media = await this.loadMedia(mediaId).catch((reason) => {
                console.error('Error loading media into project', reason);
            });
            if (media) {
                project.media.set(media.id, media);
            } else {
                // TODO: Add a way for media to be marked as missing
                console.error('Could not find media', mediaId);
            }
        }
        project.deserializeFileTree(storedProject.fileTree);

        return project;
    }
    async patchStoredProject(
        project: SetRequired<Partial<StoredProject>, 'id'>
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

    async saveMedia(media: MediaItem): Promise<SaveResults> {
        this.checkPersistentStorage();

        const storedMedia: StoredMedia =
            'getMetadata' in media
                ? {
                      name: toValue(media.name),
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

            return (
                await Promise.all(
                    storedMedias.map((storedMedia) => this.mapStoredMediaToMediaItem(storedMedia))
                )
            ).filter((m) => !!m);
        } else {
            const storedMedias = await this.db.media.filter((m) => m.type !== 'Timeline').toArray();
            return (
                await Promise.all(
                    storedMedias.map((storedMedia) => this.mapStoredMediaToMediaItem(storedMedia))
                )
            ).filter((m) => !!m);
        }
    }

    private async mapStoredMediaToMediaItem(storedMedia?: StoredMedia) {
        switch (storedMedia?.type) {
            case 'ChunkedMediaFile': {
                const item = new ChunkedMediaFileItem(
                    storedMedia.metadata as ChunkedMediaFileItemMetadata
                );
                item.id = storedMedia.id;
                item.name.value = storedMedia.name;

                return item;
            }
            case 'MediaFile': {
                const item = new MediaFileItem(storedMedia.metadata as MediaFileItemMetadata);
                item.id = storedMedia.id;
                item.name.value = storedMedia.name;

                return item;
            }
            case 'Timeline': {
                const metadata = storedMedia.metadata as TimelineItemMetadata;
                if (!metadata) {
                    return;
                }

                const timeline = new Timeline(metadata.timelineConfig);

                const promises = metadata.items.map(async (itemId) => {
                    const item = await this.loadTimelineItem(itemId, timeline);
                    if (item) timeline.items.set(itemId, item);
                });
                await Promise.allSettled(promises);

                for (const [path, value] of Object.entries(storedMedia.metadata)) {
                    timeline.addMetadata(path as any, value);
                }
                timeline.id = storedMedia.id;

                return timeline;
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

    async loadTimelineItem(itemId: string, timeline: Timeline): Promise<TimelineItem | undefined> {
        const storedItem = await this.db.timelineItem.get({ id: itemId });
        if (!storedItem) return;

        const item = new TimelineItem(timeline);
        item.id = storedItem.id;
        item.end.value = storedItem.end;
        item.layer.value = storedItem.layer;
        item.name.value = storedItem.name;
        item.start.value = storedItem.start;
        // TODO: Map stored effects to effect objects
        // item.effects.push(...)

        return item;
    }

    async saveTimelineItem(item: TimelineItem): Promise<SaveResults> {
        this.checkPersistentStorage();

        const storedTimelineItem: StoredTimelineItem = {
            name: toValue(item.name),
            id: item.id,
            effects: toValue(item.effects),
            end: toValue(item.end),
            layer: toValue(item.layer),
            start: toValue(item.start)
        };

        try {
            await this.db.timelineItem.put(storedTimelineItem);
            return 'Success';
        } catch (error) {
            console.error(error);
            return 'Error';
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
