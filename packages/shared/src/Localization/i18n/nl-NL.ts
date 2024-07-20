import type { LocalizationFile } from '../LocaleManager';

export default {
    messages: {
        general: {
            actions: {
                open: 'Open',
                search: 'Zoeken'
            },
            descriptions: {
                untitled: 'Naamloos',
                name: 'Naam | Namen',
                type: 'Type | Types',
                project: 'Project | Projecten',
                duration: 'Duur',
                modified: 'Aangepast',
                fileType: 'Bestandstype | Bestandstypen',
                refresh: 'Herladen'
            }
        },
        project: {
            new: 'Nieuw project',
            types: {
                simple: 'Simpel'
            }
        },
        panels: {
            library: {
                title: 'Bibliotheek'
            },
            timeline: {
                title: 'Tijdlijn'
            },
            monitor: {
                title: 'Monitor'
            }
        }
    },
    dateTimeFormat: {
        short: {
            day: 'numeric',
            month: 'numeric',
            year: '2-digit'
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
