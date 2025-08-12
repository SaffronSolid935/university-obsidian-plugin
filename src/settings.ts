import UnivresityPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

//#region Settings-Defenition

/**
 * Template for the university plugin settings. It is used in the Settings-Tab of the university plugin.
 */
export interface UniversityPluginSettings
{
    timeformat: string,
    semesters: number;
    currentSemester: number;
    lastSelectedModuleIndex: number;
    modules: Array<Array<string>>;
}

/**
 * This are the default settings and this is used, when there is no setting for a specific property.
 */
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

//#endregion

/**
 * This is the official university settings tab. 
 * Normally instantiated automatically by the plugin.
 */
export class UniversitySettingsTab extends PluginSettingTab {
    
    //#region Properties
    /**
     * This is the reference to the modified university plugin.
     */
    private plugin: UnivresityPlugin;

    /** 
     * SaveSettings is method, which is setted dynamically. This method is used to save the settings permamently.
     * (No worries, it will be automatically setted by the university plugin)
     */
    private saveSettings: () => Promise<any>;
    //#endregion


    /**
     * Creates an instance of the university settings tab. Will be automatically created by the university plugin.
     * @param app 
     * @param plugin 
     * @param saveSettingsMethod This method is used to save the settings, mich will be setted mostly here.
     */
    constructor(app: App, plugin: UnivresityPlugin, saveSettingsMethod: ()=>Promise<any>)
    {
        super(app,plugin);
        this.plugin = plugin;
        this.saveSettings = saveSettingsMethod;
    }

//#region Lifecycle

    /**
     * Generates the whole settings tab.
     */
    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Help & Documentation')
            .setDesc('Click the link to visit the documentation page.')
            .addButton(button => {
                button.setButtonText('Open documentation')
                    .setCta()
                    .onClick(()=>{
                        window.open('https://github.com/SaffronSolid935/university-obsidian-plugin/blob/main/USAGE.md')
                    });
            });

        new Setting(containerEl)
            .setName('Locale')
            .setDesc('This is used for the date- & timeformat.')
            .addText(text => text
                .setPlaceholder('en-EN')
                .setValue(this.plugin.settings.timeformat)
                .onChange( async (value)=>{
                    this.plugin.settings.timeformat = value;
                    await this.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Semesters')
            .setDesc('The number of semesters you have.')
            .addText(text => text
                .setPlaceholder('6')
                .setValue(this.plugin.settings.semesters.toString())
                .onChange( async (value) => {
                    this.plugin.settings.semesters = await this.settingToNumber(value);
                    await this.saveSettings();
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
                this.saveSettings();
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
                        this.saveSettings();
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
                            this.saveSettings();
                        })
                    );
            });
        });
    }

    //#endregion

    //#region Tools

    /**
     * Converts the string to a number. This is used due the input elements for the settings do not have the input type number.
     * @param value It expects the string value from the setting.
     * @param defaultValue 
     * @returns 
     */

    private async settingToNumber(value: string, defaultValue: number = -1) : Promise<number> {
        const numberValue = Number(value);
        if (!isNaN(numberValue))
        {
            return numberValue;
        }
        return defaultValue;
    }

    /**
     * Resizes an array in a more traditionally way.
     * @param old 
     * @param newSize 
     * @returns 
     */
    private resizeArray<T>(old: Array<T>, newSize: number) : Array<T>
    {
        let newArray: Array<T> = [];
        for (var i = 0; i < newSize; i++)
        {
            newArray[i] = i < old.length ? old[i] : old[old.length - 1];
        }
        return newArray;
    }

    //#endregion
}