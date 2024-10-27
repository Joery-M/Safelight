import { router } from '@/router';
import { Storage } from '@safelight/shared/base/Storage';
import type { Project } from '@safelight/shared/Project/Project';
import type { Timeline } from '@safelight/shared/Timeline/Timeline';
import { defineStore } from 'pinia';
import { computed, ref, shallowReadonly, shallowRef } from 'vue';

export const useProject = defineStore('Project', () => {
    const currentProject = shallowRef<Project>();

    function $reset() {
        if (currentProject.value) {
            // Save asynchronously, then already clear reference
            currentProject.value.save().then();

            currentProject.value = undefined;
        }
    }

    async function toEditor(projectId: string) {
        await router.push({
            name: `Editor`,
            params: {
                projectId
            }
        });
    }

    async function openProject(selectedProject: { id: string }) {
        if (!Storage.hasStorage()) {
            const IndexedDbStorageController = (
                await import('@safelight/shared/Storage/LocalStorage/IndexedDbStorage')
            ).IndexedDbStorageController;

            Storage.setStorage(new IndexedDbStorageController());
        }

        const project = await Storage.getStorage().loadProject(selectedProject.id);

        currentProject.value = project;
        return !!project;
    }

    const creators = {
        async newSimpleProject(goToEditor = true) {
            const IndexedDbStorageController = (
                await import('@safelight/shared/Storage/LocalStorage/IndexedDbStorage')
            ).IndexedDbStorageController;
            Storage.setStorage(new IndexedDbStorageController());
            const Project = (await import('@safelight/shared/Project/Project')).Project;

            const proj = new Project();

            // TODO: Make configurable
            const timeline = await proj.createTimeline({
                framerate: 60,
                width: 1920,
                height: 1080,
                name: 'Main'
            });

            selectedTimeline.value = timeline.id;
            currentProject.value = proj;

            await proj.save();

            if (goToEditor) await toEditor(proj.id);
            return proj;
        }
    };

    const selectedTimeline = ref<string>();

    return {
        isLoaded: computed(() => !!currentProject.value),
        p: shallowReadonly(currentProject),
        timeline: computed(() => {
            const item = selectedTimeline.value
                ? currentProject.value?.media.get(selectedTimeline.value)
                : undefined;

            return item?.isTimeline() ? item : undefined;
        }),
        selectTimeline: (timeline: Timeline | string) => {
            selectedTimeline.value = typeof timeline === 'string' ? timeline : timeline.id;
        },
        selectedTimeline,
        openProject,
        toEditor,
        creators,
        $reset
    };
});
