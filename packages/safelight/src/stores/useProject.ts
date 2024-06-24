import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProject = defineStore('Project', () => {
    const cursor = ref(0);

    return {
        cursor
    };
});
