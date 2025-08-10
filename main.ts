import {App, Notice, Plugin, PluginManifest, WorkspaceLeaf} from 'obsidian';
import { UniversityView, VIEW_UNIVERSITY } from 'src/view';
import { DEFAULT_SETTINGS, UniversityPluginSettings, UniversitySettingsTab } from 'src/settings';
import { NoteFileCreator } from 'src/files/note';
import { LecutreFileCreator } from 'src/files/lecture';
import { ImporterPopUpView } from 'src/files/import/importer';
import { LectureImporterView, VIEW_LECUTRE_IMPORTER } from 'src/files/import/lectureInporter';
import { ReadingFileCreator } from 'src/files/reading';
import { ReadingImporterView, VIEW_READING_IMPORTER } from 'src/files/import/readingImporter';
// import navbarCSS from "./styles/navbar.css";

// const STYLESHEETS: Array<string> = [
//     navbarCSS
// ];

export default class UnivresityPlugin extends Plugin
{
    settings: UniversityPluginSettings;
    noteFileCreator: NoteFileCreator;
    lectureFileCreator: LecutreFileCreator;
    readingFileCreator: ReadingFileCreator;

    private uView: UniversityView;

    public setUniversityView(view: UniversityView)
    {
        this.uView = view;
    }

    public async updateUniversityView()
    {
        await this.uView.onOpen();
    }


    constructor(app: App, manifest: PluginManifest)
    {
        super(app, manifest);
        this.noteFileCreator = new NoteFileCreator(app, this);
        this.lectureFileCreator = new LecutreFileCreator(app, this);
        this.readingFileCreator = new ReadingFileCreator(app,this);
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
        this.registerView(
            VIEW_READING_IMPORTER,
            (leaf) => new ReadingImporterView(leaf,this)
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