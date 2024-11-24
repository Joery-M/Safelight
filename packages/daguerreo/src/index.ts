export class Daguerreo {
    private _source: DaguerreoSourceEffect | undefined;
    public get source(): DaguerreoSourceEffect | undefined {
        return this._source;
    }
    private set source(value: DaguerreoSourceEffect | undefined) {
        this._source = value;
    }

    private effects: DaguerreoTransformEffect[] = [];
    private curProcessor: ReadableStreamDefaultReader<DaguerreoStreamPayload> | undefined;

    addEffect(effect: DaguerreoTransformEffect) {
        this.effects.push(effect);
    }
    removeEffect(effect: DaguerreoTransformEffect) {
        this.effects.slice(this.effects.indexOf(effect) - 1, 1);
    }
    setSource(source: DaguerreoSourceEffect) {
        if (this.source) {
            return;
        }
        this.source = source;
    }

    process() {
        const effectBase = this.source;
        if (!effectBase) throw new Error('No source effect defined');

        const stream = this.effects.reduce(
            (stream, effect) => stream.pipeThrough(effect.transform),
            effectBase.source
        );

        return (this.curProcessor = stream.getReader());
    }

    async stop() {
        await this.curProcessor?.cancel();
        this.curProcessor?.releaseLock();
    }
}

export interface DaguerreoTransformEffect {
    name: string;
    type: 'transform';
    transform: TransformStream<DaguerreoStreamPayload, DaguerreoStreamPayload>;
}
export interface DaguerreoSourceEffect {
    name: string;
    type: 'source';
    source: ReadableStream<DaguerreoStreamPayload>;
}

export type DaguerreoEffect = DaguerreoSourceEffect | DaguerreoTransformEffect;

export interface DaguerreoStreamPayload {
    data: ImageData;
}
