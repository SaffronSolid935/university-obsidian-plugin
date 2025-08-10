import { copyFile } from "fs/promises";
import UnivresityPlugin from "main";
import { App, FileSystemAdapter, PaneType, TFile, Vault, WorkspaceLeaf } from "obsidian";
import * as path from "path";
import { stringify } from "querystring";
import { TAdvancedFile, MetaFile } from "./metafile";

/**
 * The meta file name.
 */
const METADATA_FILE = 'meta.json';

/**
 * the MetaHandler handles on file import and creation the meta file.
 */
export class MetaHandler
{
    //#region Properties
    protected metaData:MetaFile;
    protected plugin: UnivresityPlugin;
    protected app: App;
    protected path: string;
    //#endregion
    constructor(app: App,plugin: UnivresityPlugin)
    {
        this.app = app;
        this.plugin = plugin;
        this.setDefaultMeta();
    }

    /**
     * Sets the path where the meta file will be saved.
     * @param path 
     */
    public async setPath(path: string)
    {
        this.path = path;
        await this.readMetaAsync();
    }
    
    /**
     * Template to create a file in the over the method 'setPath' given path.
     * @returns 
     */
    public async createFileAsync() : Promise<string|null>
    {
        return null;
    }

    /**
     * Saves the Meta file at the set path.
     */
    protected async saveMetaAsync()
    {
        console.log(this.metaData);
        const raw = JSON.stringify(this.metaData);
        console.log(raw);
        
        const vault = this.app.vault;

        const path = this.getMetaPath();
        
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
    
    /**
     * Reads and load the meta file from the set path.
     */
    protected async readMetaAsync()
    {
        const path = this.getMetaPath();

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

    /**
     * Returns the meta file path.
     * @returns 
     */
    private getMetaPath() : string
    {
        return `${this.path}/${METADATA_FILE}`;
    }

    /**
     * Returns the path with the given file.
     */
    protected getPath(file: string) : string
    {
        return `${this.path}/${file}`;
    }

    /**
     * Template for requesting files.
     * @returns 
     */
    public async getFilesAsync(): Promise<Array<TAdvancedFile>>
    {
        return [];
    }

    /**
     * Opens the given file path in the main view (text editor).
     * @param path 
     * @param replaceLeaf true = replacing the currently active content | false = opens the file in a new tab.
     * @returns 
     */
    public async openFileInEditor(path: string, replaceLeaf: boolean = true) : Promise<boolean>
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

    /**
     * This method do not realy import a file. It is called by the importer to add the imported file to the meta file.
     * This is currently only for meta purposes.
     * @param path 
     * @param label 
     * @returns 
     */
    public async importFile(path: string, label: string) : Promise<string|null>
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

    /**
     * Set the default meta data content.
     */
    protected setDefaultMeta(): void {
        this.metaData = new MetaFile();
    }
}