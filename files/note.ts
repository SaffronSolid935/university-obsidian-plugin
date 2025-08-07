
import UnivresityPlugin from "main";
import { IMetaFile, MetaFile, MetaHandler, TAdvancedFile } from "./metaHandler";
import { App } from "obsidian";



export class NoteFileCreator extends MetaHandler
{
    metaData: MetaFile;
    constructor(app: App, plugin: UnivresityPlugin)
    {
        super(app, plugin, false);

        this.setDefaultMeta();
    }

    setDefaultMeta(): void {
        this.metaData = new MetaFile();
        console.log("Hi + ", this.metaData);
    }

    async createFileAsync(): Promise<string|null> 
    {
        const date = new Date();
        
        const path = this.getPath(`${date.toISOString().split('T')[0]}.md`);
        
        
        if (!(await this.app.vault.adapter.exists(path)))
        {
            
            const content  =
`---
Timestamp: ${date.toLocaleDateString(this.plugin.settings.timeformat)}
Semester: ${this.plugin.settings.currentSemester + 1}
Module: ${this.plugin.settings.modules[this.plugin.settings.currentSemester][this.plugin.settings.lastSelectedModuleIndex]}
---
`;
            await this.app.vault.create(path,content);
            
            let abstractFile = this.app.vault.getFileByPath(path);
            console.log("Not File: " + path + " - " + abstractFile);
            if (abstractFile)
            {
                console.log("1");
                let file: TAdvancedFile = new TAdvancedFile(abstractFile);
                console.log("2");
                const rawLabel = date.toLocaleDateString(this.plugin.settings.timeformat);
                file.label = rawLabel;
                file.date = date;
                file.setIndexByPreIndex(this.metaData.getHighestIndex());
                console.log("3");
                this.metaData.files.push(file);
                console.log("4");
                
                await this.saveMetaAsync();
                console.log("5");
            }
        }

        return path;
    }

    async getFilesAsync(): Promise<Array<TAdvancedFile>>
    {
        await this.readMetaAsync(MetaFile.fromObject, this.setDefaultMeta);
        console.log(this.setDefaultMeta);
        console.log("Meta: ", this.metaData);
        console.log("Meta2: ", typeof(this.metaData));
        
        this.metaData.sortByDate();

        return this.metaData.files;
    }

    _getLocale() : string
    {
        const locale = this.plugin.settings.timeformat;
        if (NoteFileCreator.validateLocale(locale))
        {
            return locale;
        }

        return NoteFileCreator.getDefaultLocale();
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