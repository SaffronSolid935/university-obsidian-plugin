import { VIEW_IMPORTER, ImporterPopUpView } from 'src/files/import/importer';
import { VIEW_LECUTRE_IMPORTER } from 'src/files/import/lectureInporter';
import { VIEW_READING_IMPORTER } from 'src/files/import/readingImporter';
import { MetaHandler } from 'src/files/metaHandler';
import UnivresityPlugin from 'main';
import { FileManager, ItemView, Notice, Plugin, TAbstractFile, TFile, WorkspaceLeaf } from 'obsidian';

export const NOTES = 'notes';
export const LECTURES = 'lectures';
export const READINGS = 'readings';
export const VIEW_UNIVERSITY = 'University';

interface INavbarData 
{
    id: string;
    label: string;
    onClick: (documentSection: DocumentSection) => any;
    element: HTMLLIElement | null;
    documentSection: DocumentSection
}

enum DocumentSection
{  
    Notes,
    Lectures,
    Readings
}

interface IFileData
{
    name: string;
    filename: string;
    path: string;
    date: Date | undefined;
    abstractFile: TAbstractFile;
}

export class UniversityView extends ItemView
{
    _currentDocumentSection: DocumentSection = DocumentSection.Notes;

    _navbarData: Array<INavbarData> = [
        {
            id: NOTES,
            label: 'Notes',
            onClick: (id) => {this._onNavbarClick(id)},
            element: null,
            documentSection: DocumentSection.Notes
        },
        {
            id: 'lectures',
            label: 'Lectures',
            onClick: (id) => {this._onNavbarClick(id)},
            element: null,
            documentSection: DocumentSection.Lectures
        },
        {
            id: 'readings',
            label: 'Readings',
            onClick: (id) => {this._onNavbarClick(id)},
            element: null,
            documentSection: DocumentSection.Readings
        }
    ];

    _plugin: UnivresityPlugin;
    _semesterOptions: Array<string> = [];

    private subLeaf: WorkspaceLeaf;
    
    constructor (leaf: WorkspaceLeaf, plugin: UnivresityPlugin)
    {
        super(leaf);
        this._plugin = plugin;
        plugin.setUniversityView(this);
    }

    getViewType()
    {
        return VIEW_UNIVERSITY;
    }

    getDisplayText(): string {
        return 'University (view)';
    }

    getIcon(): string {
        return 'graduation-cap';
    }
    
    _generateSemesterOptions()
    {
        for (var i = 0; i < this._plugin.settings.semesters; i++)
        {
            this._semesterOptions.push(`Semester ${i + 1}`);
        }
    }

    async createSubFolderIfNotExists(sub: string) : Promise<string>
    {
        const path = this._plugin.getSubModulePath(sub);
        const adapter = this.app.vault.adapter;
        if (!(await adapter.exists(path)))
        {
            this.app.vault.createFolder(path);
        }
        return path;
    }

        
    async onOpen()
    {
        await this._generateCurrentFolderIfNotExists();
        const container = this.containerEl.children[1];
        container.empty();
        if (!container.classList.contains('university-view-container'))
            container.addClass('university-view-container');

        if (this._semesterOptions.length != this._plugin.settings.semesters)
        {
            this._generateSemesterOptions();
        }
        
        var semesterCombobox = await this.generateSelection(
            container,
            'semester-select',
            this._semesterOptions,
            this._plugin.settings.currentSemester,
            async (event, index, value)=>{
                const select = event.target as HTMLSelectElement;
                await this._selectSemester(index);
                await this.onOpen();
            }
        );

        let moduleList = this._plugin.settings.modules[this._plugin.settings.currentSemester]
        
        var moduleCombobox = await this.generateSelection(
            container,
            'module-select',
            moduleList,
            this._plugin.settings.lastSelectedModuleIndex,
            async (event, index, value) => {
                await this._selectModule(index);
            }
        );

        await this.generateNavBar(container);

        console.log("Doc: " + this._currentDocumentSection);
        let sectionPath;
        switch (this._currentDocumentSection)
        {
            case DocumentSection.Notes:
                sectionPath = await this.createSubFolderIfNotExists(NOTES);
                this._plugin.noteFileCreator.setPath(sectionPath);
                await this.generateFileSection(container,this._plugin.noteFileCreator, 'Create note',async ()=>{
                    const path = await this._plugin.noteFileCreator.createFileAsync();

                    if (path)
                    {
                        const opened = await this._plugin.noteFileCreator.openFileInEditor(path)
                    }
                    this.onOpen();
                });
                break;
            case DocumentSection.Lectures:
                sectionPath = await this.createSubFolderIfNotExists(LECTURES);
                this._plugin.lectureFileCreator.setPath(sectionPath);
                await this.generateFileSection(container, this._plugin.lectureFileCreator, 'Import lecture', async ()=>{
                    // const path = await this._plugin.lectureFileCreator.importFile()

                    // new UniversityView();
                    const { workspace } = this.app;

                    let leaf: WorkspaceLeaf | null = null;
                    const leaves = workspace.getLeavesOfType(VIEW_LECUTRE_IMPORTER);

                    if (leaves.length > 0)
                    {
                        leaf = leaves[0];
                    } else 
                    {
                        leaf = workspace.getRightLeaf(false);
                        await leaf?.setViewState({ type: VIEW_LECUTRE_IMPORTER, active: true});
                    }

                    if (leaf != null)
                    {
                        this.subLeaf = leaf;
                        workspace.revealLeaf(leaf);
                    }
                    else
                        new Notice('Error');
                });
                break;
            case DocumentSection.Readings:
                // await this.generateReadingsSection(container);
                sectionPath = await this.createSubFolderIfNotExists(READINGS);
                this._plugin.readingFileCreator.setPath(sectionPath);
                await this.generateFileSection(container,this._plugin.readingFileCreator,'Import reading',async ()=>{
                    const { workspace } = this.app;

                    let leaf: WorkspaceLeaf | null = null;
                    const leaves = workspace.getLeavesOfType(VIEW_READING_IMPORTER);

                    if (leaves.length > 0)
                    {
                        leaf = leaves[0];
                    } else 
                    {
                        leaf = workspace.getRightLeaf(false);
                        await leaf?.setViewState({ type: VIEW_READING_IMPORTER, active: true});
                    }

                    if (leaf != null)
                    {
                        this.subLeaf = leaf;
                        workspace.revealLeaf(leaf);
                    }
                    else
                        new Notice('Error');
                });
                break;
        }


        // container.createEl('h4',{text:'sd'});
        // var button = container.createEl('button',{text:'hello world'});
        // button.addEventListener("click", () => this.click());
    }
    async generateFileSection(container: Element, fileCreator: MetaHandler, fileCreateText: string, fileCreateMethod: (event: MouseEvent)=>any)
    {

        const files = await fileCreator.getFilesAsync();

        const div = container.createDiv();
        div.addClass('university-notes-div');

        files.forEach((value)=>{
            let button = div.createEl('button',{text:value.label});
            button.addEventListener('click',async ()=>{
                var opened = await fileCreator.openFileInEditor(value.path);
                if (!opened)
                {
                    console.error(`File ${value.path} not found (code: 204).`);
                    new Notice(`File '${value.name}' not found (204).`);
                }
            });

            button.addEventListener('mouseup',async (event)=>{
                if (event.button === 1)
                {
                    var opened = await fileCreator.openFileInEditor(value.path, false);
                    if (!opened)
                    {
                        console.error(`File ${value.path} not found (code: 204b).`);
                        new Notice(`File '${value.name}' not found (204b).`);
                    }
                }
            });
        });

        const button = container.createEl('button',{text:fileCreateText});
        button.addClass('university-notes-create-button');
        button.addEventListener('click',fileCreateMethod);
    }

    async generateNavBar(container: Element)
    {
        let navbar = container.createEl('ul');
        navbar.addClass('university-navbar-parent')

        this._navbarData.forEach((navbarItem, index)=>{ // here
            let navbarOption = navbar.createEl('li');
            navbarOption.createEl('label',{text:navbarItem.label});
            navbarOption.addClass('university-navbar-child');
            navbarOption.addEventListener('click',(event)=>{navbarItem.onClick(navbarItem.documentSection)});
            this._navbarData[index].element = navbarOption;
        });

        this._navbarData.forEach((value) => {
            if (value.documentSection == this._currentDocumentSection)
            {
            }
            if (value.element != null)
            value.element.className = value.documentSection == this._currentDocumentSection ? 'university-navbar-child-active' : 'university-navbar-child';
        });


    }

    _onNavbarClick(documentSection: DocumentSection)
    {
        this._currentDocumentSection = documentSection;
        this.onOpen();
    }

    _getNavbarItem(id: string):INavbarData | null
    {
        for (var i = 0; i < this._navbarData.length; i++)
        {
            if (this._navbarData[i].id == id)
            {
                return this._navbarData[i];
            }
        }
        return null;
    }

    async generateSelection(container: Element, id: string, options: Array<string>, selectedIndex: number, listener: (ev: Event, index: number, value: string) => any) : Promise<HTMLSelectElement>
    {
        let combobox = container.createEl('select');
        combobox.id = id;
        options.forEach((value, index) =>
        {
            let option = combobox.createEl('option');
            option.innerText = value;
            option.value = index.toString();
        }); 
        
        combobox.selectedIndex = selectedIndex;
        combobox.addEventListener('change', (event)=>{
            listener(event, combobox.selectedIndex, options[combobox.selectedIndex]);
        });

        combobox.addClass("university-combobox")

        return combobox;
    }

    async _generateCurrentFolderIfNotExists()
    {   
        const path = this._plugin.getModulePath();
        const adapter = this.app.vault.adapter;
        if (!(await adapter.exists(path)))
        {
            this.app.vault.createFolder(path);
        }
    }

    async _selectSemester(index: number)
    {
        this._plugin.settings.currentSemester = index;
        this._plugin.settings.lastSelectedModuleIndex = 0;
        this._plugin.saveSettings();
        new Notice(`Semester ${index + 1} selected`);

        const path = this._plugin.getSemesterPath();

        const adapter = this.app.vault.adapter;

        if (!(await adapter.exists(path)))
        {
            await this.app.vault.createFolder(path);
        }
    }

    async _selectModule(index: number)
    {
        this._plugin.settings.lastSelectedModuleIndex = index;
        this._plugin.saveSettings();

        const path = this._plugin.getModulePath();;

        const adapter = this.app.vault.adapter;

        if (!(await adapter.exists(path)))
        {
            await this.app.vault.createFolder(path);
        }
        this.onOpen();

    }

    async onClose() {
        this.subLeaf.detach();
    }
}