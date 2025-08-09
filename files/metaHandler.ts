import { copyFile } from "fs/promises";
import UnivresityPlugin from "main";
import { App, FileSystemAdapter, PaneType, TFile, Vault, WorkspaceLeaf } from "obsidian";
import * as path from "path";
import { stringify } from "querystring";

const METADATA_FILE = 'meta.json';
export interface IMetaFile
{

    files: Array<TAdvancedFile>;
}
export class MetaFile implements IMetaFile
{
    files: TAdvancedFile[];
    constructor()
    {
        this.files = [];
    }

    static fromObject(data: IMetaFile)
    {
        let metaData = new MetaFile();
        metaData.files = data.files;
        console.log(metaData);
        for (let i = 0; i < metaData.files.length; i++)
        {
            metaData.files[i].date = new Date(metaData.files[i].date);
        }
        console.log(metaData);
        return metaData;
    }

    getHighestIndex() : number
    {
        let highest = -1;
        for (var i = 0; i < this.files.length; i++)
        {
            if (this.files[i].index > highest)
            {
                highest = this.files[i].index;
            }
        }
        return highest;
    }

    sortByIndex(desc: boolean)
    {
        this.files.sort((a,b)=>{
            let returnValue = 0;
            if (a && b)
            {
                returnValue = a.index - b.index
            }
            else if (a)
            {
                returnValue = -1;
            }
            else if (b)
            {
                returnValue = 1;
            }
            
            return returnValue * (desc ? -1 : 1);
        });
    }

    sortByDate()
    {
        this.files.sort((a,b)=>{
            const dateA = a.date;
            const dateB = b.date;

            if (dateA && dateB)
            {
                return dateB.getDate() - dateA.getDate();
            }
            return 0;
        });
    }
}
export class TAdvancedFile
{
    basename: string;
    extension: string;
    name: string;
    path: string;
    constructor(file: TFile | null)
    {
        if (file)
        {
            this.basename = file.basename;
            this.extension = file.extension;
            this.name = file.name;
            this.path = file.path;
        }
    }

    label: string;
    index: number;
    date: Date;

    setIndexByPreIndex(preIndex: number)
    {
        this.index = preIndex + 1;
    }
}

export interface IMetaHandler
{
    getFilesAsync(): Promise<Array<TAdvancedFile>>
}

export class MetaHandler
{
    metaData:MetaFile;
    plugin: UnivresityPlugin;
    app: App;
    path: string;
    constructor(app: App,plugin: UnivresityPlugin)
    {
        this.app = app;
        this.plugin = plugin;
        this.setDefaultMeta();
    }

    async setPath(path: string)
    {
        this.path = path;
        await this.readMetaAsync();
    }

    async createFileAsync() : Promise<string|null>
    {
        return null;
    }

    async saveMetaAsync()
    {
        console.log(this.metaData);
        const raw = JSON.stringify(this.metaData);
        console.log(raw);
        
        const vault = this.app.vault;

        const path = this._getMetaPath();
        
        const file = vault.getFileByPath(path);

        console.log(`Meta: ${path} - ${file}`);
        
        if (!(await vault.adapter.exists(path)))
        {
            await vault.create(path,raw);
        }
        else if (file && file instanceof TFile)
        {
            await vault.modify(file,raw);
        }

    }

    async readMetaAsync()
    {
        const path = this._getMetaPath();

        if (await this.app.vault.adapter.exists(path))
        {
            const file = this.app.vault.getFileByPath(path);
            console.log(`file: ${file}`);
            if (file && file instanceof TFile)
            {
                const raw = await this.app.vault.read(file);

                this.metaData = MetaFile.fromObject(JSON.parse(raw));
            }
        }
        else
        {
            this.setDefaultMeta();
        }
    }

    _getMetaPath() : string
    {
        return `${this.path}/${METADATA_FILE}`;
    }

    getPath(file: string) : string
    {
        return `${this.path}/${file}`;
    }

    // setDefaultMeta()
    // {
    //     // this.metaData = {};
    // }
    
    async getFilesAsync(): Promise<Array<TAdvancedFile>>
    {
        return [];
    }

    async openFileInEditor(path: string, replaceLeaf: boolean = true) : Promise<boolean>
    {
        const file = this.app.vault.getFileByPath(path);
        if (!file || !(file instanceof TFile))
        {
            return false;
        }
        const workspace = this.app.workspace;
        let leaf: WorkspaceLeaf;
        if (replaceLeaf)
        {
            leaf = workspace.getLeaf();
        }
        else
        {
            leaf = workspace.getLeaf(true);
        }

        leaf.openFile(file);

        return true;
    }

    async importFile(path: string, label: string) : Promise<string|null>
    {
        let file = this.app.vault.getFileByPath(path)
        if (file)
        {
            await this.readMetaAsync();
            console.log(file.path);
            
            let metaDataFile = new TAdvancedFile(file);
            metaDataFile.label = label;
            metaDataFile.setIndexByPreIndex(this.metaData.getHighestIndex());
            metaDataFile.date = new Date();
            this.metaData.files.push(metaDataFile);
            await this.saveMetaAsync();

            this.plugin.updateUniversityView();
            return file.path;
        }
        return null;
    }

    _getAbsoluteFolderPath(): string | null
    {
        let basePath: string;
        let adapter = this.app.vault.adapter;
        if (adapter instanceof FileSystemAdapter)
        {
            basePath = adapter.getBasePath();
            return path.join(basePath, this.path);
        }
        return null;
    }


    setDefaultMeta(): void {
        this.metaData = new MetaFile();
        console.log("Hi + ", this.metaData);
    }
}