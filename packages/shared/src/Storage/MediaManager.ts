import { Observable } from 'rxjs';

export default class MediaManager {
    static storeMedia(file: File) {
        return new Observable<LoadMediaProgress>((subscriber) => {});
    }

    static generateThumbnail() {}
}

interface LoadMediaProgress {
    type: 'fileInfo' | 'thumbnail' | 'hash' | 'done';
    id?: string;
    hashProgress: number;
}
