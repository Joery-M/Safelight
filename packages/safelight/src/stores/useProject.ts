export const useProject = defineStore('Project', () => {
    const cursor = ref(0);

    const isLoaded = ref(false);

    return {
        isLoaded,
        cursor
    };
});
