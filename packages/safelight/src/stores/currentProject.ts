import type BaseProject from '@safelight/shared/base/Project';
import { ProjectFeatures, type ProjectType } from '@safelight/shared/base/Project';
import BaseStorageController, { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import { DateTime } from 'luxon';
import { computed, shallowRef } from 'vue';

export class CurrentProject {
    // see #14 for why
    public static project = shallowRef<BaseProject>();
    public static isLoaded = computed(() => !!this.project.value);

    public static async openProject(
        selectedProject: StoredProject | SessionProject,
        goToEditor = true
    ) {
        const storageType = await this.getStorageControllerForProject(selectedProject.type);
        if (!storageType) {
            throw new Error('Could not find storage controller for project type');
        }

        Storage.setStorage(storageType);

        const project = await Storage.getStorage().loadProject(selectedProject.id);

        if (project) {
            this.setProject(project);
            this.setSessionProject(selectedProject);
            if (goToEditor) await this.toEditor();
        } else {
            console.error('Could not load project');
        }
    }

    public static async toEditor() {
        // Prevent circular dependency
        await (await import('../main')).router.push('/editor');
    }

    public static async newSimpleProject(goToEditor = true) {
        const IndexedDbStorageController = (
            await import('@safelight/shared/Storage/LocalStorage/IndexedDbStorage')
        ).IndexedDbStorageController;
        Storage.setStorage(new IndexedDbStorageController());
        const SimpleProject = (await import('@safelight/shared/Project/SimpleProject')).default;

        const proj = new SimpleProject();

        // TODO: Make configurable
        proj.createTimeline({
            framerate: 60,
            width: 1920,
            height: 1080,
            name: 'Main'
        });

        this.setProject(proj);

        await proj.Save();
        this.setSessionProject(proj);

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
            return new (
                await import('@safelight/shared/Storage/LocalStorage/IndexedDbStorage')
            ).IndexedDbStorageController();
        } else {
            console.error('Project type not supported');
        }
    }

    public static setProject(newProject: BaseProject) {
        this.project.value = newProject;
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

    public static async beforeExit(clearSession = true) {
        if (this.project.value) {
            this.project.value.destroy$.next();
            this.project.value.destroy$.complete();
            if (clearSession) this.clearSessionProject();
            if (this.project.value.hasFeature(ProjectFeatures.saving)) {
                await this.project.value.Save();
            }
            this.project.value = undefined;
        }
    }
}

export interface SessionProject {
    id: string;
    type: ProjectType;
    lastOpened: string;
}
