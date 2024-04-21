export const useProject = defineStore('Project', () => {
    const cursor = ref(0);

    return {
        cursor
    };
});
