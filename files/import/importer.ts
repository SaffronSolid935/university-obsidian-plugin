import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

export const VIEW_IMPORTER = "file-importer";

export class ImporterPopUpView extends ItemView
{
    protected title: string;
    protected file: File;
    askOpenFileButton: HTMLButtonElement;

    constructor(leaf: WorkspaceLeaf)
    {
        super(leaf);
        this.title = 'Importer'
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
        const labelInput = line2.createEl('input');
        labelInput.addClasses(['university-importer-subitem','university-importer-nonlabel']);

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
        
    }

    async onClose(): Promise<void> {
        
    }
}