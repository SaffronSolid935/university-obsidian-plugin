
import UnivresityPlugin from "main";
import { MetaHandler } from "./metaHandler";
import { App } from "obsidian";

export class NoteFileCreator extends MetaHandler
{

    constructor(app: App, plugin: UnivresityPlugin)
    {
        super(app, plugin);
    }

    async createFile(folderPath: string) : Promise<string>
    {
        const vault = this.app.vault;

        const date = new Date();

        const rawDate = date.toISOString().split('T')[0];
        console.log("Raw: " + rawDate);

        const path = `${folderPath}/note_${rawDate}.md`;

        if (!(await vault.adapter.exists(path)))
        {
            const content  =
`---
Timestamp: ${date.toLocaleString(this.plugin.settings.timeformat)}
Semester: ${this.plugin.settings.currentSemester + 1}
Module: ${this.plugin.settings.modules[this.plugin.settings.currentSemester][this.plugin.settings.lastSelectedModuleIndex]}
---
`;
            await vault.create(path,content);
        }

        return path;
    }

    static getDefaultLocale() : string
    {
        return 'en-EN'
    }

    static validateLocale(locale: string) : boolean
    {
        var localeResult = Intl.DateTimeFormat.supportedLocalesOf([locale]);
        if (localeResult == null || localeResult.length == 0 || localeResult.length > 1)
        {
            return false;
        }

        return localeResult.first() == locale;
    }
}