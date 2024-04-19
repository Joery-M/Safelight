import { router } from '@/main';
import type BaseProject from '@safelight/shared/base/Project';
import BaseStorageController, { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import MediaManager from '@safelight/shared/Storage/MediaManager';

export const useProject = defineStore('Project', () => {
    const cursor = ref(0);
    const timelineViewStart = ref(0);
    const timelineViewEnd = ref(0);

    const project = shallowRef<BaseProject>();
    const isLoaded = ref(false);

    function setProject(newProject: BaseProject) {
        project.value = newProject;
        isLoaded.value = true;

        useSessionStorage<string>('project', '').value = newProject.id;
    }

    function loadFile(file: File) {
        return new Promise<void>((resolve) => {
            const storingProcessing = useObservable(MediaManager.StoreMedia(file));
            watch(storingProcessing, (s) => {
                console.log(s?.type, s?.hashProgress);
            });

            watch(storingProcessing, async () => {
                if (storingProcessing.value && storingProcessing.value.type == 'done') {
                    const existingMedia = project.value!.media.some(
                        (m) => m.id == storingProcessing.value!.id
                    );

                    if (!existingMedia) {
                        const media = await Storage.getStorage().LoadMedia(
                            storingProcessing.value.id!
                        );

                        if (media) {
                            project.value!.media.push(media);
                            save();
                        }
                    }

                    resolve();
                }
            });
        });
    }

    function save() {
        if (project.value) Storage.getStorage().SaveProject(project.value);
    }

    return {
        project,
        setProject,
        loadFile,
        isLoaded,
        cursor,
        timelineViewStart,
        timelineViewEnd,
        save,
        openProject,
        new: {
            newSimpleProject
        }
    };
});

async function newSimpleProject() {
    const IndexedDbStorageController = (await import('@safelight/shared/Storage/IndexedDbStorage'))
        .default;
    Storage.setStorage(new IndexedDbStorageController());
    const projectStore = useProject();
    const SimpleProject = (await import('@safelight/shared/Project/SimpleProject')).default;
    projectStore.setProject(new SimpleProject());

    await toEditor();
}

export async function getStorageControllerForProject(
    project: StoredProject
): Promise<BaseStorageController | undefined> {
    if (project.type == 'Simple') {
        return new (await import('@safelight/shared/Storage/IndexedDbStorage')).default();
    } else {
        console.error('Project type not supported');
    }
}

async function openProject(selectedProject: StoredProject) {
    const storageType = await getStorageControllerForProject(selectedProject);
    if (!storageType) {
        throw new Error('Could not find storage controller for project type');
    }

    const projectStore = useProject();
    Storage.setStorage(storageType);

    const project = await Storage.getStorage().LoadProject(selectedProject.id);

    if (project) {
        projectStore.setProject(project);
        await toEditor();
    } else {
        console.error('Could not load project');
    }
}

async function toEditor() {
    await router.push('/editor');
}
