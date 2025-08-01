import UnivresityPlugin from 'main';
import { ItemView, Notice, Plugin, WorkspaceLeaf } from 'obsidian';

export const VIEW_UNIVERSITY = 'University';

interface NavbarData 
{
    id: string;
    label: string;
    onClick: (id: string) => any;
    element: HTMLLIElement | null;
}

export class UniversityView extends ItemView
{

    _navbarData: Array<NavbarData> = [
        {
            id: 'notes',
            label: 'Notes',
            onClick: (id) => this._onNavbarClick(id),
            element: null
        },
        {
            id: 'lectures',
            label: 'Lectures',
            onClick: (id) => this._onNavbarClick(id),
            element: null
        },
        {
            id: 'readings',
            label: 'Readings',
            onClick: (id) => this._onNavbarClick(id),
            element: null
        }
    ];

    _plugin: UnivresityPlugin;
    _semesterOptions: Array<string> = [];
    
    constructor (leaf: WorkspaceLeaf, plugin: UnivresityPlugin)
    {
        super(leaf);
        this._plugin = plugin;
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
        
    async onOpen()
    {
        await this._generateCurrentFolderIfNotExists();
        const container = this.containerEl.children[1];
        container.empty();

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


        // container.createEl('h4',{text:'sd'});
        // var button = container.createEl('button',{text:'hello world'});
        // button.addEventListener("click", () => this.click());
    }

    async generateNavBar(container: Element)
    {
        let navbar = container.createEl('ul');
        navbar.addClass('university-navbar-parent')

        this._navbarData.forEach((navbarItem, index)=>{ // here
            let navbarOption = navbar.createEl('li');
            navbarOption.createEl('label',{text:navbarItem.label});
            navbarOption.addClass('university-navbar-child');
            navbarOption.addEventListener('click',(event)=>navbarItem.onClick(navbarItem.id));
            this._navbarData[index].element = navbarOption;
        });

        this._onNavbarClick(this._navbarData.first()!.id);


    }

    _onNavbarClick(id: string)
    {
        new Notice(`${id} selected`);
        let navbarItem = this._getNavbarItem(id);
        if (navbarItem != null)
        {
            this._navbarData.forEach((value, index)=>{
                if (value.element != null)
                {
                    value.element.className = value.id == id ? 'university-navbar-child-active' : 'university-navbar-child';
                }
            });
        }
    }

    _getNavbarItem(id: string):NavbarData | null
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

        return combobox;
    }

    async _generateCurrentFolderIfNotExists()
    {   
        const path = this._getModulePath(
            this._plugin.settings.currentSemester,
            this._plugin.settings.lastSelectedModuleIndex
        );
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

        const path = this._getSemesterPath(index);

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

        const path = this._getModulePath(this._plugin.settings.currentSemester,index);

        const adapter = this.app.vault.adapter;

        if (!(await adapter.exists(path)))
        {
            await this.app.vault.createFolder(path);
        }
    }

    _getSemesterPath(semester: number) : string
    {
        return `Semester ${semester + 1}`;
    }

    _getModulePath(semester: number, module: number): string
    {
        return `${this._getSemesterPath(semester)}/${this._plugin.settings.modules[semester][module]}`;
    }

    async onClose() {
        
    }
}