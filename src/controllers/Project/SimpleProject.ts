import Media from '../Media/Media';
import SimpleTimeline from '../Timeline/SimpleTimeline';
import BaseProject, { type ProjectType } from '../base/Project';

export default class SimpleProject extends BaseProject {
    public name = 'Untitled';
    public type: ProjectType = 'Simple';

    public media: Media[] = reactive<Media[]>([]);
    public timelines = reactive<SimpleTimeline[]>([]);
    public activeTimeline: number;

    constructor() {
        super();

        const tl = new SimpleTimeline(this);

        this.timelines = [tl];
        this.activeTimeline = 0;
    }

    createMedia(file: File) {
        const newMedia = new Media(file);

        this.media.push(newMedia);

        return newMedia;
    }
}
