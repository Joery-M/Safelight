import { DateTime } from 'luxon';
import type BaseProject from '../base/Project';
import type {
    SaveResults,
    StorageControllerType,
    StoredMedia,
    StoredProject
} from '../base/Storage';
import BaseStorageController from '../base/Storage';
import type BaseTimeline from '../base/Timeline';
import Media from '../Media/Media';
import SimpleProject from '../Project/SimpleProject';
import SimpleTimeline from '../Timeline/SimpleTimeline';
import AudioTimelineItem from '../TimelineItem/AudioTimelineItem';
import VideoTimelineItem from '../TimelineItem/VideoTimelineItem';
import { NotificationService } from '../UI/Notifications/NotificationService';
import { SafelightIndexedDB } from './db';

export default class IndexedDbStorageController extends BaseStorageController {
    public type: StorageControllerType = 'IndexedDB';
    public version = '0.0.1';

    private db = new SafelightIndexedDB();

    async SaveProject(project: BaseProject, includeTimelines = true): Promise<SaveResults> {
        this.checkPersistentStorage();
        const existingProject = await this.db.project.get({ id: project.id });

        const storableProject: StoredProject = {
            id: project.id,
            name: project.name.value,
            type: project.type,
            media: project.media.map((m) => m.id).filter((id) => id !== undefined),
            timelines: project.timelines.map((m) => m.id),
            activeTimeline: project.timeline.value?.id,
            updated: DateTime.now().toISO(),
            created: existingProject?.created ?? DateTime.now().toISO()
        };

        try {
            await this.db.project.put(storableProject, project.id);

            if (includeTimelines) {
                const proms = project.timelines.map((timeline) => this.SaveTimeline(timeline));
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
                            console.error('Error loading media file for project', reason);
                        });
                        if (media) {
                            proj.media.push(media);
                        } else {
                            // TODO: Add a way for media to be marked as missing
                        }
                    });
                    const timelineFetches = project.timelines.map(async (t) => {
                        const timeline = await this.LoadTimeline<SimpleTimeline>(t).catch(
                            (reason) => {
                                console.error('Error loading timeline for project', reason);
                            }
                        );
                        if (timeline) {
                            proj.timelines.push(timeline);
                            if (timeline.id == project.activeTimeline) {
                                proj.selectTimeline(timeline);
                            }
                        }
                    });

                    // Load all timelines and media
                    await Promise.allSettled(mediaFetches);
                    await Promise.allSettled(timelineFetches);
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

    async SaveMedia(media: Media | StoredMedia): Promise<SaveResults> {
        this.checkPersistentStorage();
        const storedMedia: StoredMedia =
            'data' in media
                ? media
                : {
                      name: media.name.value,
                      id: media.id,
                      audioTracks: media.audioTracks,
                      contentHash: media.contentHash,
                      data: media.file,
                      duration: media.duration.value,
                      textTracks: media.textTracks,
                      type: media.type,
                      videoTracks: media.videoTracks,
                      fileInfo: media.fileInfo,
                      imageInfo: media.imageInfo,
                      previewImage: await (await fetch(media.previewImage.value)).blob(),
                      created: media.created.toISO()
                  };

        try {
            await this.db.media.put(storedMedia);
            return 'Success';
        } catch (error) {
            console.error(error);
            return 'Error';
        }
    }
    LoadMedia(mediaId: string): Promise<Media | undefined> {
        return new Promise((resolve, reject) => {
            this.db.media
                .get({ id: mediaId })
                .then((storedMedia) => {
                    resolve(storedMedia ? this.storedMediaToMedia(storedMedia) : undefined);
                })
                .catch(reject);
        });
    }
    async getMediaFromHash(hash: string): Promise<Media | undefined> {
        const m = await this.db.media.get({
            contentHash: hash
        });

        if (!m) return;

        const media = this.storedMediaToMedia(m);
        return media;
    }
    async hasMediaHash(hash: string): Promise<boolean> {
        const m = await this.db.media.get({
            contentHash: hash
        });
        return !!m;
    }

    private storedMediaToMedia(storedMedia: StoredMedia) {
        const media = new Media();
        media.name.value = storedMedia.name;
        media.id = storedMedia.id;

        media.duration.value = storedMedia.duration;
        media.type = storedMedia.type;
        media.videoTracks = storedMedia.videoTracks;
        media.audioTracks = storedMedia.audioTracks;
        media.textTracks = storedMedia.textTracks;
        media.file = storedMedia.data;

        if (storedMedia.imageInfo) media.imageInfo = storedMedia.imageInfo;
        if (storedMedia.fileInfo) media.fileInfo = storedMedia.fileInfo;
        if (storedMedia.previewImage)
            media.previewImage.value = URL.createObjectURL(storedMedia.previewImage);

        media.loaded.value = true;

        return media;
    }

    SaveTimeline(timeline: SimpleTimeline): Promise<SaveResults> {
        return new Promise<SaveResults>(async (resolve) => {
            await this.db.timelineItem.bulkAdd(
                Array.from(timeline.items.values()).map((item) => ({
                    duration: item.isAudio() || item.isVideo() ? item.duration.value : undefined,
                    end: item.end.value,
                    start: item.start.value,
                    type: item.type,
                    media: item.hasMedia() ? item.media.value?.id : undefined,
                    id: item.id,
                    name: item.name.value,
                    layer: item.layer.value
                }))
            );

            this.db.timeline
                .put({
                    id: timeline.id,
                    name: timeline.name.value,
                    type: timeline.type,
                    items: timeline.isSimpleTimeline()
                        ? Array.from(timeline.items.values()).map(({ id }) => id)
                        : [],
                    framerate: timeline.framerate.value,
                    height: timeline.height.value,
                    width: timeline.width.value
                })
                .catch((err) => {
                    resolve('Error');
                    console.error(err);
                })
                .then(() => {
                    resolve('Success');
                });
        });
    }
    async LoadTimeline<Timeline extends BaseTimeline = BaseTimeline>(
        timelineId: string
    ): Promise<Timeline | undefined> {
        const storedTimeline = await this.db.timeline.get(timelineId);
        if (!storedTimeline) return;

        if (storedTimeline.type == 'Simple') {
            const timeline = new SimpleTimeline({
                framerate: storedTimeline.framerate,
                height: storedTimeline.height,
                width: storedTimeline.width,
                name: storedTimeline.name
            });

            timeline.id = storedTimeline.id;

            const TLitems = await this.db.timelineItem.bulkGet(storedTimeline.items);

            const promises = TLitems.map(async (stored) => {
                if (!stored) return;

                if (stored.type == 'Audio') {
                    const item = new AudioTimelineItem();
                    item.id = stored.id;
                    item.duration.value = stored.duration!;
                    item.end.value = stored.end;
                    item.layer.value = stored.layer;
                    item.name.value = stored.name;
                    if (stored.media) {
                        item.media.value = await this.LoadMedia(stored.media);
                    }

                    timeline.items.add(item);
                } else if (stored.type == 'Video') {
                    const item = new VideoTimelineItem();

                    item.id = stored.id;
                    item.duration.value = stored.duration!;
                    item.end.value = stored.end;
                    item.layer.value = stored.layer;
                    item.name.value = stored.name;
                    if (stored.media) {
                        item.media.value = await this.LoadMedia(stored.media);
                    }

                    timeline.items.add(item);
                }
            });

            await Promise.allSettled(promises);

            return timeline as unknown as Timeline;
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
                    title: 'Project might be deleted',
                    text:
                        'Your browser might delete data when storing projects locally if it thinks you are running out of storage.\n' +
                        'Do you want to ask the browser to persist data?',
                    buttons: [
                        {
                            label: 'Persist data',
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
