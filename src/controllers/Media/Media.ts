import { v4 as uuidv4 } from 'uuid';

import { type Ref } from 'vue';

export default class Media {
    public id = uuidv4();
    public name = 'Untitled Media';
    public previewImage = '';

    constructor(public source: File) {
        this.name = source.name;
    }
}
