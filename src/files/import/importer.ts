import { MetaHandler } from "src/files/metaHandler";
import { writeFile } from "fs/promises";
import UnivresityPlugin from "main";
import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

export const VIEW_IMPORTER = "file-importer";

export class ImporterPopUpView extends ItemView
{
    protected sub: string;
    protected title: string;
    protected file: File;
    private askOpenFileButton: HTMLButtonElement;
    private labelInput: HTMLInputElement;

    private plugin: UnivresityPlugin;
    private fileHandler: MetaHandler;

    protected setFileHandler(fileHandler: MetaHandler)
    {
        this.fileHandler = fileHandler;
    }


    constructor(leaf: WorkspaceLeaf, plugin: UnivresityPlugin)
    {
        super(leaf);
        this.plugin = plugin;
        this.title = 'Importer'
        this.sub = 'dummy';
    }

    getViewType(): string {
        return VIEW_IMPORTER;
    }

    getDisplayText(): string {
        return 'File importer';
    }

    public setTitle(title: string)
    {
        this.title = title;
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
            input.remove();
        };

        document.body.appendChild(input);
        input.click();
    }

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