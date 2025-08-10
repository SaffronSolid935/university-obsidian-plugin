import UnivresityPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface UniversityPluginSettings
{
    timeformat: string,
    semesters: number;
    currentSemester: number;
    lastSelectedModuleIndex: number;
    modules: Array<Array<string>>;
}

export const DEFAULT_SETTINGS: UniversityPluginSettings = {
    timeformat: 'en-EN',
    semesters: 6,
    currentSemester: 0,
    lastSelectedModuleIndex: 0,
    modules: [
        [
            'Sample module'
        ]
    ]
}


export class UniversitySettingsTab extends PluginSettingTab {
    plugin: UnivresityPlugin;

    constructor(app: App, plugin: UnivresityPlugin)
    {
        super(app,plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Locale')
            .setDesc('This is used for the date- & timeformat.')
            .addText(text => text
                .setPlaceholder('en-EN')
                .setValue(this.plugin.settings.timeformat)
                .onChange( async (value)=>{
                    this.plugin.settings.timeformat = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Semesters')
            .setDesc('The number of semesters you have')
            .addText(text => text
                .setPlaceholder('6')
                .setValue(this.plugin.settings.semesters.toString())
                .onChange( async (value) => {
                    this.plugin.settings.semesters = await this.settingToNumber(value);
                    await this.plugin.saveSettings();
                    this.display();
                })
            );

        containerEl.createEl('h2',{text:'Modules'});

        this.plugin.settings.modules = this.resizeArray(this.plugin.settings.modules, this.plugin.settings.semesters);
        for (var i = 0; i < this.plugin.settings.modules.length; i++)
        {
            if (this.plugin.settings.modules[i] == null)
            {
                this.plugin.settings.modules[i] = [];
                this.plugin.saveSettings();
            }
        }
    
        this.plugin.settings.modules.forEach((modulesInSemester, i)=>{
            containerEl.createEl('h3',{text:`Semester ${i + 1}`});
            new Setting(containerEl)
                .setName('Modules count')
                .addText(text => text
                    .setPlaceholder('6')
                    .setValue(modulesInSemester.length.toString())
                    .onChange( async (value) => {
                        let newLength = await this.settingToNumber(value);
                        let newArray = this.resizeArray<string>(modulesInSemester,newLength);
                        this.plugin.settings.modules[i] = newArray;
                        this.plugin.saveSettings();
                        this.display();
                    })
                );

            modulesInSemester.forEach((module, j) => {
                new Setting(containerEl)
                    .setName(`#${j + 1}`)
                    .addText(text => text
                        .setPlaceholder('Module name')
                        .setValue(module)
                        .onChange( async (value) => {
                            this.plugin.settings.modules[i][j] = value;
                            this.plugin.saveSettings();
                        })
                    );
            });
        });
    }

    async settingToNumber(value: string, defaultValue: number = -1) : Promise<number> {
        const numberValue = Number(value);
        if (!isNaN(numberValue))
        {
            return numberValue;
        }
        return defaultValue;
    }

    resizeArray<T>(old: Array<T>, newSize: number) : Array<T>
    {
        let newArray: Array<T> = [];
        for (var i = 0; i < newSize; i++)
        {
            newArray[i] = i < old.length ? old[i] : old[old.length - 1];
        }
        return newArray;
    }
}