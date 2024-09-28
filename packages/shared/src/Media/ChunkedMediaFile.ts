import { v4 as uuidv4 } from 'uuid';
import { MediaItem } from './Media';

export class ChunkedMediaFileItem extends MediaItem {
    public id = uuidv4();
    public name = '';
}
