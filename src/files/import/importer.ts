import { MetaHandler } from "src/files/metaHandler";
import { writeFile } from "fs/promises";
import UnivresityPlugin from "main";
import { ItemView, Notice, Workspace, WorkspaceLeaf } from "obsidian";

/**
 * Default file importert view id.
 */
export const VIEW_IMPORTER = "file-importer";

/**
 * Allows to import a file wich source is outside of the vault.
 */
export class ImporterPopUpView extends ItemView
{
    //#region properties
    /**
     * The sub folder of the modules path.
     */
    protected sub: string;
    /**
     * The title of the view; 
     */
    protected title: string;
    /**
     * The file data, which should be imported.
     */
    protected file: File;
    /**
     * The HTML open file button. This is used, to update the button text to the file name.
     */
    private askOpenFileButton: HTMLButtonElement;
    /**
     * The input which should not be changed, when updating the view.
     */
    private labelInput: HTMLInputElement;

    /**
     * This is the University Plugin. It is used to get some settings.
     */
    private plugin: UnivresityPlugin;
    /**
     * The filehandler is needed to update the metafiles (on file import) and opening the file.
     */
    private fileHandler: MetaHandler;

    //#endregion

    /**
     * This will be instantiated by the University view.
     * @param leaf 
     * @param plugin The university plugin.
     */
    constructor(leaf: WorkspaceLeaf, plugin: UnivresityPlugin)
    {
        super(leaf);
        this.plugin = plugin;
        this.title = 'Importer'
        this.sub = 'dummy';
    }

    //#region Lifecycle
    getViewType(): string {
        return VIEW_IMPORTER;
    }

    getDisplayText(): string {
        return 'File importer';
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1];

        container.empty();
        container.createEl('h1',{text:this.title});

        const line1 = container.createDiv();
        line1.addClass('university-importer-item');

        const fileLabel = line1.createEl('label', {text:'File:'});
        fileLabel.addClasses(['university-importer-subitem','university-importer-label']);
        if (this.askOpenFileButton == undefined || this.askOpenFileButton == null)
        {
            this.askOpenFileButton = line1.createEl('button',{text:'Select file'});
            this.askOpenFileButton.addEventListener('click',()=>this.askOpenFileDialog('application/pdf'));
            this.askOpenFileButton.addClasses(['university-importer-subitem','university-importer-nonlabel']);
        }
        const line2 = container.createDiv();
        line2.addClass('university-importer-item');

        const labelLabel = line2.createEl('label', {text:'Label:'});
        labelLabel.addClasses(['university-importer-subitem','university-importer-label']);
        if (this.labelInput == undefined || this.labelInput == null)
        {
            const labelInput = line2.createEl('input');
            labelInput.addClasses(['university-importer-subitem','university-importer-nonlabel']);
            this.labelInput = labelInput;
        }

        const importButton = container.createEl('button',{text:'Import'});
        importButton.addClass('university-importer-item');
        importButton.addEventListener('click',()=>this.import());
    }
    //#endregion
    
    /**
     * Sets the filehandler;
     * @param fileHandler 
     */
    protected setFileHandler(fileHandler: MetaHandler)
    {
        this.fileHandler = fileHandler;
    }
    
    /**
     * Sets the title of the importer view
     * @param title 
     */
    public setTitle(title: string)
    {
        this.title = title;
    }

    /**
     * Opens the file dialog, which asks for the given filetype. 
     * @param types The filetype, as the html input elements like.
     */
    private async askOpenFileDialog(types: string)
    {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = types;
        input.style.display = 'none';

        input.onchange = () => {
            if (input.files && input.files.length > 0)
            {
                this.file = input.files.item(0)!;
                this.askOpenFileButton.innerText = this.file.name!;
            }
            else
            {
                new Notice('Select a file to import');
            }
            input.remove();
        };

        document.body.appendChild(input);
        input.click();
    }

    /**
     * Saves the selected file inside the vault.
     */
    private async import()
    {
        const targetPath = this.plugin.getSubModulePath(this.sub);
        const targetFilePath = `${targetPath}/${this.file.name}`;
        const arrayBuffer = await this.file.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);
        
        const vault = this.app.vault;

        await vault.createBinary(targetFilePath,buffer);

        await this.fileHandler.importFile(targetFilePath,this.labelInput.value);
        await this.fileHandler.openFileInEditor(targetFilePath,true);

    }

    async onClose(): Promise<void> {
        
    }
}