import type { LocalizationFile } from '../LocaleManager';

export default {
    messages: {
        general: {
            actions: {
                open: 'Open',
                search: 'Search'
            },
            descriptions: {
                untitled: 'Untitled',
                name: 'Name | Names',
                type: 'Type',
                project: 'Project | Projects',
                duration: 'Duration',
                fileType: 'File type'
            }
        },
        project: {
            new: 'New project'
        },
        panels: {
            library: {
                title: 'Library'
            },
            timeline: {
                title: 'Timeline'
            },
            monitor: {
                title: 'Monitor'
            }
        }
    }
} as LocalizationFile;
