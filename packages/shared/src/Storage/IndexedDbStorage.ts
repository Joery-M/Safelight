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
import type SimpleTimeline from '../Timeline/SimpleTimeline';
import { SafelightIndexedDB } from './db';

export default class IndexedDbStorageController extends BaseStorageController {
    public type: StorageControllerType = 'IndexedDB';
    public version = '0.0.1';

    private db = new SafelightIndexedDB();

    async SaveProject(project: BaseProject): Promise<SaveResults> {
        const existingProject = await this.db.project.get({ id: project.id });

        const storableProject: StoredProject = {
            id: project.id,
            name: project.name,
            type: project.type,
            media: project.media.map((m) => m.id).filter((id) => id !== undefined),
            timelines: project.timelines.map((m) => m.id),
            updated: DateTime.now().toISO(),
            created: existingProject?.created ?? DateTime.now().toISO()
        };

        try {
            await this.db.project.put(storableProject, project.id);
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
    getProjects(): Promise<StoredProject[]> {
        return this.db.project.toArray();
    }

    async SaveMedia(media: Media | StoredMedia): Promise<SaveResults> {
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
                    if (storedMedia) {
                        resolve(this.storedMediaToMedia(storedMedia));
                    }
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async SaveTimeline(_timeline: BaseTimeline): Promise<SaveResults> {
        throw new Error('Method not implemented.');
    }
    LoadTimeline<Timeline extends BaseTimeline = BaseTimeline>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _timelineId: string
    ): Promise<Timeline | undefined> {
        throw new Error('Method not implemented.');
    }
}
