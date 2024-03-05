export const isIsolated = true;

export const Darkroom = {
    async import(b: string | URL) {
        const stringUrl = new URL(b).href;

        DarkroomAPI.import(stringUrl);
    }
};
