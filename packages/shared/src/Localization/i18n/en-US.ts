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
                type: 'Type | Types',
                project: 'Project | Projects',
                duration: 'Duration',
                modified: 'Modified',
                fileType: 'File type | File types',
                refresh: 'Refresh'
            }
        },
        project: {
            new: 'New project',
            types: {
                simple: 'Simple'
            }
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
    },
    dateTimeFormat: {
        short: {
            dateStyle: 'short'
        },
        medium: {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        },
        long: {
            dateStyle: 'long'
        },
        dateTime: {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        },
        time: {
            hour: 'numeric',
            minute: 'numeric'
        },
        timeLong: {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        },
        timeFull: {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        }
    }
} as LocalizationFile;
