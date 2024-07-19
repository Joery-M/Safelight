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
                type: 'Type',
                project: 'Project | Projecten',
                duration: 'Duur',
                fileType: 'Bestandstype'
            }
        },
        project: {
            new: 'Nieuw project'
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
    }
} as LocalizationFile;
