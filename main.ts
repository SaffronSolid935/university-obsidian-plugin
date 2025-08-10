import {App, Notice, Plugin, PluginManifest, WorkspaceLeaf} from 'obsidian';
import { UniversityView, VIEW_UNIVERSITY } from 'src/view';
import { DEFAULT_SETTINGS, UniversityPluginSettings, UniversitySettingsTab } from 'src/settings';
import { NoteFileCreator } from 'src/files/note';
import { LecutreFileCreator } from 'src/files/lecture';
import { LectureImporterView, VIEW_LECUTRE_IMPORTER } from 'src/files/import/lectureInporter';
import { ReadingFileCreator } from 'src/files/reading';
import { ReadingImporterView, VIEW_READING_IMPORTER } from 'src/files/import/readingImporter';

export default class UnivresityPlugin extends Plugin
{
    //#region Properties
    settings: UniversityPluginSettings;
    
    // File creator used in src/view.ts
    noteFileCreator: NoteFileCreator;
    lectureFileCreator: LecutreFileCreator;
    readingFileCreator: ReadingFileCreator;

    // Needed for src/files/import/importer.ts to reload the university view.
    private uView: UniversityView;

    //#endregion
        
    constructor(app: App, manifest: PluginManifest)
    {
        super(app, manifest);
        this.noteFileCreator = new NoteFileCreator(app, this);
        this.lectureFileCreator = new LecutreFileCreator(app, this);
        this.readingFileCreator = new ReadingFileCreator(app,this);
    }

    //#region  Plugin
    
    async onload()
    {
        await this.loadSettings();
        // this.loadStyles();
        this.registerView(
            VIEW_UNIVERSITY,
            (leaf) => new UniversityView(leaf,this)
        );
        this.registerView(
            VIEW_LECUTRE_IMPORTER,
            (leaf) => new LectureImporterView(leaf,this)
        );
        this.registerView(
            VIEW_READING_IMPORTER,
            (leaf) => new ReadingImporterView(leaf,this)
        );
        this.addRibbonIcon('graduation-cap','University',(evt) => this.openSidebar());
        // ribbonIcon.addClass('my-plugin-ribbon-class');

        var settingsTab = new UniversitySettingsTab(this.app,this,this.saveSettings.bind(this));

        this.addSettingTab(settingsTab);
    }

    /**
     * Loads the plugin settings, wich can be setted in obsidian over the settings>University.
     */
    private async loadSettings() 
    {
        this.settings = Object.assign({},DEFAULT_SETTINGS, await this.loadData());
    }


    /**
     * Saves the plugin settings. Only meant for settings, wich is why, it is private.
     */
    private async saveSettings()
    {
        await this.saveData(this.settings);
    }
    //#endregion

    //#region PluginAdditionalMethods

    /**
     * Opens the UniversityView on the left sidebar.
     */

    private async openSidebar() {
        // new UniversityView();
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_UNIVERSITY);

        if (leaves.length > 0)
        {
            leaf = leaves[0];
        } else 
        {
            leaf = workspace.getLeftLeaf(false);
            await leaf?.setViewState({ type: VIEW_UNIVERSITY, active: true});
        }

        if (leaf != null)
            workspace.revealLeaf(leaf);
        else
            new Notice('Error');
    }

    /**
     * Set the university view when it is opened.
     * @param view 
     */
    
    public setUniversityView(view: UniversityView)
    {
        this.uView = view;
    }
    
    /**
     * Updates the University View, when it's opened.
     */
    public async updateUniversityView()
    {
        await this.uView?.onOpen();
    }

    //#region Path

    /**
     * Returns the relative semester path of the current semester. The semester can be selected over the University View. 
     * @returns 
     */
    public getSemesterPath() : string
    {
        return `Semester ${this.settings.currentSemester + 1}`;
    }
    
    /**
     * Returns the relative module path (with semester). The module can be selected over the University View
     * @returns 
     */
    public getModulePath()
    {
        return `${this.getSemesterPath()}/${this.settings.modules[this.settings.currentSemester][this.settings.lastSelectedModuleIndex]}`;
    }


    /**
     * Returns the relative sub path (with module & semester). The subpath is given by the code and not any setting.
     * @param sub 
     * @returns 
     */
    public getSubModulePath(sub: string): string
    {
        return `${this.getModulePath()}/${sub}`;
    }

    //#endregion

    //#endregion
}