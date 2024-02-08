export function FileToAudioBuffer(file: File) {
    return new Promise((resolve, reject) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        file.arrayBuffer()
            .then((buffer) => audioCtx.decodeAudioData(buffer))
            .then((buffer) => {
                const track = audioCtx.createBufferSource();
                track.buffer = buffer;
                track.connect(audioCtx.destination);
                track.start(0);
                resolve(track);
            });
    });
}

export function FileToAudioBufferSection(file: File, begin: number, end: number) {
    return new Promise((resolve, reject) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        file.arrayBuffer()
            .then((buffer) => audioCtx.decodeAudioData(buffer))
            .then((buffer) => {
                const track = audioCtx.createBufferSource();
                track.buffer = buffer;
                track.connect(audioCtx.destination);
                track.start(0, audioCtx.sampleRate * begin, audioCtx.sampleRate * end);
                resolve(track);
            });
    });
}
