import { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import type { Project } from '@safelight/shared/Project/Project';
import { DateTime } from 'luxon';
import { computed, shallowRef } from 'vue';

export class CurrentProject {
    // see #14 for why
    public static project = shallowRef<Project>();
    public static isLoaded = computed(() => !!this.project.value);

    public static async openProject(
        selectedProject: StoredProject | SessionProject,
        goToEditor = true
    ) {
        if (!Storage.hasStorage()) {
            const IndexedDbStorageController = (
                await import('@safelight/shared/Storage/LocalStorage/IndexedDbStorage')
            ).IndexedDbStorageController;

            Storage.setStorage(new IndexedDbStorageController());
        }

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
        const SimpleProject = (await import('@safelight/shared/Project/Project')).Project;

        const proj = new SimpleProject();

        // TODO: Make configurable
        proj.createTimeline({
            framerate: 60,
            width: 1920,
            height: 1080,
            name: 'Main'
        });

        this.setProject(proj);

        await proj.save();
        this.setSessionProject(proj);

        if (goToEditor) await this.toEditor();
    }

    public static setProject(newProject: Project) {
        this.project.value = newProject;
    }

    public static setSessionProject(project: StoredProject | Project | SessionProject) {
        const sessionProject: SessionProject = {
            id: project.id,
            lastOpened: DateTime.now().toISO()
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
            if (clearSession) this.clearSessionProject();
            await this.project.value.save();
            this.project.value = undefined;
        }
    }
}

export interface SessionProject {
    id: string;
    lastOpened: string;
}
