import Timecode from '@/helpers/Timecode';

export const useProject = defineStore('Project', {
    state: () => ({
        project: new SimpleProject(),
        cursor: new Timecode(0),
        timelineViewStart: new Timecode(0),
        timelineViewEnd: new Timecode(10000)
    }),
    getters: {
        activeTimeline(state) {
            return state.project.timelines[state.project.activeTimeline];
        }
    }
});
