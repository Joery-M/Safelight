import type BaseProject from '@safelight/shared/base/Project';
import { Storage } from '@safelight/shared/base/Storage';
import MediaManager from '@safelight/shared/Storage/MediaManager';

export const useProject = defineStore('Project', () => {
    const cursor = ref(0);
    const timelineViewStart = ref(0);
    const timelineViewEnd = ref(0);

    const project = shallowRef<BaseProject>();

    function setProject(newProject: BaseProject) {
        project.value = newProject;
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

                    console.log(existingMedia);
                    if (!existingMedia) {
                        const media = await Storage.getStorage().LoadMedia(
                            storingProcessing.value.id!
                        );

                        if (media) {
                            project.value!.media.push(media);
                            save();
                        }
                        // project.activeTimeline.createTimelineItem(media);
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
        cursor,
        timelineViewStart,
        timelineViewEnd,
        save
    };
});
