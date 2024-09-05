import { TimelineElement, TimelineElementTypes } from '..';

export class TimelineGrid implements TimelineElement {
    type: TimelineElementTypes.generic = TimelineElementTypes.generic;
    renderStep?: 'before' | 'after' | undefined = 'before';

    render: TimelineElement['render'] = ({ ctx, manager }) => {
        ctx.fillStyle = 'white';
        ctx.fillRect(200, 50, 50, 50);
    };
}
