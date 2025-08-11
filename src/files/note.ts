
import UnivresityPlugin from "main";
import {MetaHandler} from "./metaHandler";
import { App, Notice } from "obsidian";
import { MetaFile, TAdvancedFile } from "./metafile";



export class NoteFileCreator extends MetaHandler
{
    metaData: MetaFile;
    constructor(app: App, plugin: UnivresityPlugin)
    {
        super(app, plugin);
    }

    public async createFileAsync(): Promise<string|null> 
    {
        const date = new Date();
        
        const path = this.getPath(`${date.toISOString().split('T')[0]}.md`);
        
        
        if (!(await this.app.vault.adapter.exists(path)))
        {
            
            const content  =
`---
Timestamp: ${date.toLocaleDateString(this.getLocale())}
Semester: ${this.plugin.settings.currentSemester + 1}
Module: ${this.plugin.settings.modules[this.plugin.settings.currentSemester][this.plugin.settings.lastSelectedModuleIndex]}
---
`;
            await this.app.vault.create(path,content);
            
            let abstractFile = this.app.vault.getFileByPath(path);
            if (abstractFile)
            {
                let file: TAdvancedFile = new TAdvancedFile(abstractFile);
                const rawLabel = date.toLocaleDateString(this.plugin.settings.timeformat);
                file.label = rawLabel;
                file.date = date;
                file.setIndexByPreIndex(this.metaData.getHighestIndex());
                this.metaData.files.push(file);
                
                await this.saveMetaAsync();
            }
        }
        else
        {
            new Notice('Info: file already exists.');
        }

        return path;
    }

    public async getFilesAsync(): Promise<Array<TAdvancedFile>>
    {
        await this.readMetaAsync();
        
        this.metaData.sortByDate();

        return this.metaData.files;
    }

    /**
     * Request the locale time format.
     * @returns 
     */
    private getLocale() : string
    {
        const locale = this.plugin.settings.timeformat;
        if (NoteFileCreator.validateLocale(locale))
        {
            return locale;
        }

        return NoteFileCreator.getDefaultLocale();
    }

    /**
     * Returns a default locale time format.
     * @returns 
     */
    private static getDefaultLocale() : string
    {
        return 'en-EN'
    }

    /**
     * Validates the locale time format.
     * @param locale 
     * @returns 
     */
    private static validateLocale(locale: string) : boolean
    {
        var localeResult = Intl.DateTimeFormat.supportedLocalesOf([locale]);
        if (localeResult == null || localeResult.length == 0 || localeResult.length > 1)
        {
            return false;
        }

        return localeResult.first() == locale;
    }
}