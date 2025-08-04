import UnivresityPlugin from "main";
import { App, TFile } from "obsidian";

const METADATA_FILE = 'meta.json';

export class TAdvancedFile extends TFile
{ 
    label: string;
}

export interface IMetaHandler
{
    getFile():Array<TAdvancedFile>;
}

export class MetaHandler
{
    metaData:object;
    plugin: UnivresityPlugin;
    app: App;
    constructor(app: App,plugin: UnivresityPlugin)
    {
        this.app = app;
        this.plugin = plugin;
        this.metaData = {};
    }

    async saveMetaAsync(path: string)
    {
        const raw = JSON.stringify(this.metaData);
        
        const vault = this.app.vault;

    }
    
    getFile():Array<TAdvancedFile>
    {
        return [];
    }
}