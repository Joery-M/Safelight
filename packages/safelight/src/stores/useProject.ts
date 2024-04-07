import SimpleProject from '@safelight/shared/Project/SimpleProject';

export const useProject = defineStore('Project', () => {
    const activeTimelineIndex = ref(0);
    const cursor = ref(0);
    const timelineViewStart = ref(0);
    const timelineViewEnd = ref(0);

    const project = new SimpleProject();

    return {
        cursor,
        timelineViewStart,
        timelineViewEnd
    };
});
