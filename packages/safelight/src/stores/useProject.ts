import Media from '@/controllers/Media/Media';
import SimpleTimeline from '@/controllers/Timeline/SimpleTimeline';
import Timecode from '@safelight/shared/timecode';

export const useProject = defineStore('Project', () => {
    const name = ref('Untitled');
    const media = ref<Media[]>([]);
    const timelines = ref<SimpleTimeline[]>([new SimpleTimeline()]);
    const activeTimelineIndex = ref(0);
    const cursor = Timecode.from(0);
    const timelineViewStart = Timecode.from(0);
    const timelineViewEnd = Timecode.from(0);

    const activeTimeline = computed(() => timelines.value[activeTimelineIndex.value]);

    function getMediaFromID(id: string) {
        return useArrayFind(media, (m) => m.id == id);
    }

    return {
        name,
        media,
        timelines,
        cursor,
        timelineViewStart,
        timelineViewEnd,
        activeTimeline,
        getMediaFromID
    };
});
