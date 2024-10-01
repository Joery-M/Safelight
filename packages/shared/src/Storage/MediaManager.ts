import { Observable } from 'rxjs';

export default class MediaManager {
    static StoreMedia(file: File) {
        return new Observable<LoadMediaProgress>((subscriber) => {
            // Thanks RxJs, makes sense
            (async () => {
                // TODO: implement after #34
            })();
        });
    }
}

interface LoadMediaProgress {
    type: 'fileInfo' | 'thumbnail' | 'hash' | 'done';
    id?: string;
    hashProgress: number;
}
