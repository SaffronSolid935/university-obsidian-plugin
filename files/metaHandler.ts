import UnivresityPlugin from "main";
import { App, PaneType, TFile, Vault, WorkspaceLeaf } from "obsidian";
import { stringify } from "querystring";

const METADATA_FILE = 'meta.json';

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
    metaData:object;
    plugin: UnivresityPlugin;
    app: App;
    path: string
    constructor(app: App,plugin: UnivresityPlugin, init: boolean = true)
    {
        this.app = app;
        this.plugin = plugin;
        console.log("Hey: " + init);
        if (init)
        {
            // this.setDefaultMeta();
        }
    }

    setPath(path: string)
    {
        this.path = path;
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

    async readMetaAsync(setMetaFromObject: (data: object) => any, setDefault: () => any = () => {})
    {
        const path = this._getMetaPath();

        const file = this.app.vault.getFileByPath(path);

        if (file && file instanceof TFile)
        {
            if (await this.app.vault.adapter.exists(path))
            {
                const raw = await this.app.vault.read(file);

                this.metaData = setMetaFromObject(JSON.parse(raw));
            }
            else
            {
                setDefault();
            }
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
}