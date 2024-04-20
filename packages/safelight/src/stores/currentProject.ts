import { router } from '@/main';
import type BaseProject from '@safelight/shared/base/Project';
import BaseStorageController, { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import MediaManager from '@safelight/shared/Storage/MediaManager';

// ---
//
// A global `shallowRef` is used to keep state for reasons outlined in #14
//
// ---

export class CurrentProject {
    public static project = shallowRef<BaseProject>();

    public static async openProject(selectedProject: StoredProject, goToEditor = true) {
        const storageType = await this.getStorageControllerForProject(selectedProject);
        if (!storageType) {
            throw new Error('Could not find storage controller for project type');
        }

        Storage.setStorage(storageType);

        const project = await Storage.getStorage().LoadProject(selectedProject.id);

        if (project) {
            this.setProject(project);
            if (goToEditor) await this.toEditor();
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

    public static async getStorageControllerForProject(
        project: StoredProject
    ): Promise<BaseStorageController | undefined> {
        if (project.type == 'Simple') {
            return new (await import('@safelight/shared/Storage/IndexedDbStorage')).default();
        } else {
            console.error('Project type not supported');
        }
    }

    public static setProject(newProject: BaseProject) {
        this.project.value = newProject;
        const projectStore = useProject();
        projectStore.isLoaded = true;

        useSessionStorage<string>('project', '').value = newProject.id;
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
}
