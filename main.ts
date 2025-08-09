import {App, Notice, Plugin, PluginManifest, WorkspaceLeaf} from 'obsidian';
import { UniversityView, VIEW_UNIVERSITY } from 'view';
import { DEFAULT_SETTINGS, UniversityPluginSettings, UniversitySettingsTab } from 'settings';
import { NoteFileCreator } from 'files/note';
import { LecutreFileCreator } from 'files/lecture';
import { ImporterPopUpView } from 'files/import/importer';
import { LectureImporterView, VIEW_LECUTRE_IMPORTER } from 'files/import/lectureInporter';
// import navbarCSS from "./styles/navbar.css";

// const STYLESHEETS: Array<string> = [
//     navbarCSS
// ];

export default class UnivresityPlugin extends Plugin
{
    settings: UniversityPluginSettings;
    noteFileCreator: NoteFileCreator;
    lectureFileCreator: LecutreFileCreator;


    constructor(app: App, manifest: PluginManifest)
    {
        super(app, manifest);
        this.noteFileCreator = new NoteFileCreator(app, this);
        this.lectureFileCreator = new LecutreFileCreator(app, this);
    }

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
        this.addRibbonIcon('graduation-cap','University',(evt) => this._openSidebar());
        // ribbonIcon.addClass('my-plugin-ribbon-class');

        this.addSettingTab(new UniversitySettingsTab(this.app, this));
    }

    // loadStyles()
    // {
    //     const pluginFolder = this.manifest.dir;

    //     STYLESHEETS.forEach(file => {

    //         const linkEl = document.createElement('style');
    //         linkEl.textContent = file;
    //         document.head.appendChild(linkEl);
    //     });
    // }

    async _openSidebar() {
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

    async loadSettings() 
    {
        this.settings = Object.assign({},DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings()
    {
        await this.saveData(this.settings);
    }

    public getSemesterPath() : string
    {
        return `Semester ${this.settings.currentSemester + 1}`;
    }

    public getModulePath()
    {
        return `${this.getSemesterPath()}/${this.settings.modules[this.settings.currentSemester][this.settings.lastSelectedModuleIndex]}`;
    }

    public getSubModulePath(sub: string): string
    {
        return `${this.getModulePath()}/${sub}`;
    }
}