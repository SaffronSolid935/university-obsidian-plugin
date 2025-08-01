import {Notice, Plugin, WorkspaceLeaf} from 'obsidian';
import { UniversityView, VIEW_UNIVERSITY } from 'view';
import { DEFAULT_SETTINGS, UniversityPluginSettings, UniversitySettingsTab } from 'settings';
// import navbarCSS from "./styles/navbar.css";

// const STYLESHEETS: Array<string> = [
//     navbarCSS
// ];

export default class UnivresityPlugin extends Plugin
{
    settings: UniversityPluginSettings;
    async onload()
    {
        await this.loadSettings();
        // this.loadStyles();
        this.registerView(
            VIEW_UNIVERSITY,
            (leaf) => new UniversityView(leaf,this)
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
}