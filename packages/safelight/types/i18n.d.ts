
import 'vue-i18n';
declare module 'vue-i18n' {
    export interface DefineLocaleMessage {
    general: {
        actions: {
            open: string;
            search: string;
        },
        descriptions: {
            untitled: string;
            name: string;
            type: string;
            project: string;
            duration: string;
            modified: string;
            fileType: string;
            refresh: string;
        }
    },
    project: {
        new: string;
        types: {
            simple: string;
        }
    },
    panels: {
        library: {
            title: string;
        },
        timeline: {
            title: string;
        },
        monitor: {
            title: string;
            upload: string;
        }
    }
}
}