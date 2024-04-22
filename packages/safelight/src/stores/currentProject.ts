/* eslint-disable no-dupe-class-members */
import { router } from '@/main';
import type BaseProject from '@safelight/shared/base/Project';
import type { ProjectType } from '@safelight/shared/base/Project';
import BaseStorageController, { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import MediaManager from '@safelight/shared/Storage/MediaManager';
import { DateTime } from 'luxon';

export class CurrentProject {
    // see #14 for why
    public static project = shallowRef<BaseProject>();
    public static isLoaded = ref(false);

    public static async openProject(
        selectedProject: StoredProject | SessionProject,
        goToEditor = true
    ) {
        this.isLoaded.value = false;
        const storageType = await this.getStorageControllerForProject(selectedProject.type);
        if (!storageType) {
            throw new Error('Could not find storage controller for project type');
        }

        Storage.setStorage(storageType);

        const project = await Storage.getStorage().LoadProject(selectedProject.id);

        if (project) {
            this.setProject(project);
            this.setSessionProject(selectedProject);
            if (goToEditor) await this.toEditor();
            this.isLoaded.value = true;
        } else {
            console.error('Could not load project');
        }
    }

    public static async toEditor() {
        await router.push('/editor');
    }

    public static async newSimpleProject(goToEditor = true) {
        const IndexedDbStorageController = (
            await import('@safelight/shared/Storage/IndexedDbStorage')
        ).default;
        Storage.setStorage(new IndexedDbStorageController());
        const SimpleProject = (await import('@safelight/shared/Project/SimpleProject')).default;
        this.setProject(new SimpleProject());

        if (goToEditor) await this.toEditor();
    }

    public static getStorageControllerForProject(
        project: ProjectType
    ): Promise<BaseStorageController | undefined>;
    public static getStorageControllerForProject(
        project: StoredProject
    ): Promise<BaseStorageController | undefined>;
    public static async getStorageControllerForProject(project: StoredProject | ProjectType) {
        const type = typeof project === 'string' ? project : project.type;
        if (type == 'Simple') {
            return new (await import('@safelight/shared/Storage/IndexedDbStorage')).default();
        } else {
            console.error('Project type not supported');
        }
    }

    public static setProject(newProject: BaseProject) {
        this.project.value = newProject;
        this.isLoaded.value = true;
    }

    public static setSessionProject(project: StoredProject | BaseProject | SessionProject) {
        const sessionProject: SessionProject = {
            id: project.id,
            lastOpened: DateTime.now().toISO(),
            type: project.type
        };
        sessionStorage.setItem('project', JSON.stringify(sessionProject));
    }
    public static getSessionProject() {
        const item = window.sessionStorage.getItem('project');
        if (!item) return;
        return JSON.parse(item) as SessionProject;
    }
    public static clearSessionProject() {
        sessionStorage.removeItem('project');
    }

    // Might want to move this to BaseProject or SimpleProject
    public static loadFile(file: File) {
        return new Promise<void>((resolve) => {
            const storingProcessing = useObservable(MediaManager.StoreMedia(file));
            watch(storingProcessing, (s) => {
                console.log(s?.type, s?.hashProgress);
            });

            watch(storingProcessing, async () => {
                if (storingProcessing.value && storingProcessing.value.type == 'done') {
                    const existingMedia = this.project.value!.media.some(
                        (m) => m.id == storingProcessing.value!.id
                    );

                    if (!existingMedia) {
                        const media = await Storage.getStorage().LoadMedia(
                            storingProcessing.value.id!
                        );

                        if (media) {
                            this.project.value!.media.push(media);
                            this.save();
                        }
                    }

                    resolve();
                }
            });
        });
    }

    public static async save() {
        if (this.project.value) await Storage.getStorage().SaveProject(this.project.value);
    }

    public static async beforeExit(clearSession = true) {
        if (this.project.value) {
            this.project.value.destroy$.next();
            this.project.value.destroy$.complete();
            if (clearSession) this.clearSessionProject();
            await this.save();
            this.project.value = undefined;
        }
    }
}

export interface SessionProject {
    id: string;
    type: ProjectType;
    lastOpened: string;
}
