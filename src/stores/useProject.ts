import Media from '@/controllers/Media/Media';
import SimpleTimeline from '@/controllers/Timeline/SimpleTimeline';
import Timecode from '@/helpers/Timecode';
import type { UnwrapNestedRefs } from 'vue';

export const useProject = defineStore('Project', () => {
    const name = ref('Untitled');
    const media = ref<Media[]>([]);
    const timelines = ref<SimpleTimeline[]>([new SimpleTimeline()]);
    const activeTimelineIndex = ref(0);
    const cursor = ref(new Timecode(0));
    const timelineViewStart = ref(new Timecode(0));
    const timelineViewEnd = ref(new Timecode(0));

    const activeTimeline = computed(() => timelines.value[activeTimelineIndex.value]);

    function getMediaFromID(id: string) {
        return media.value.find((m) => m.id == id);
    }

    function createMedia(file: File) {
        const newMedia = new Media(file);

        media.value.push(newMedia as unknown as UnwrapNestedRefs<Media>);

        return getMediaFromID(newMedia.id)!;
    }

    return {
        name,
        media,
        timelines,
        cursor,
        timelineViewStart,
        timelineViewEnd,
        activeTimeline,
        getMediaFromID,
        createMedia
    };
});
