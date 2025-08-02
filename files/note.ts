
import UnivresityPlugin from "main";

export class NoteFileCreator
{
    _plugin: UnivresityPlugin;

    constructor(plugin: UnivresityPlugin)
    {
        this._plugin = plugin;
    }

    async createFile(folderPath: string) : Promise<string>
    {
        const vault = this._plugin.app.vault;

        const date = new Date();

        const rawDate = date.toLocaleDateString(this._plugin.settings.timeformat);

        const path = `${folderPath}/note_${rawDate}.md`;

        if (!(await vault.adapter.exists(path)))
        {
            const content  =
`---
Timestamp: ${date.toLocaleString(this._plugin.settings.timeformat)}
Semester: ${this._plugin.settings.currentSemester + 1}
Module: ${this._plugin.settings.modules[this._plugin.settings.currentSemester][this._plugin.settings.lastSelectedModuleIndex]}
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