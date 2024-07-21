import 'vue-i18n';
declare module 'vue-i18n' {
    export interface DefineLocaleMessage {
        general: {
            default: string;
            loading: string;
            actions: {
                open: string;
                search: string;
                skipBackFrame: string;
                skipForwardFrame: string;
                sortAscending: string;
                sortDescending: string;
                sortBy: string;
                loadFile: string;
                resetValue: string;
            };
            descriptions: {
                untitled: string;
                name: string;
                type: string;
                project: string;
                duration: string;
                modified: string;
                fileType: string;
                refresh: string;
            };
        };
        project: {
            new: string;
            types: {
                simple: string;
            };
        };
        media: {
            properties: string;
            attrs: {
                video: string;
                audio: string;
                subtitles: string;
                image: string;
            };
        };
        panels: {
            noPanel: string;
            library: {
                title: string;
                noMediaLoaded: string;
                noMediaFound: string;
            };
            timeline: {
                title: string;
            };
            monitor: {
                title: string;
                upload: string;
            };
        };
    }
}
