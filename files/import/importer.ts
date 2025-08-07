import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

export const VIEW_IMPORTER = "file-importer";

export class ImporterPopUpView extends ItemView
{
    protected title: string;
    protected fileNameInput: HTMLInputElement;
    protected file: File;

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

        container.createEl('label', {text:'Source:'});
        this.fileNameInput = container.createEl('input');
        let askOpenFileButton = container.createEl('button',{text:'...'});
        askOpenFileButton.addEventListener('click',()=>this.askOpenFileDialog('application/pdf'));
        container.createEl('label', {text:'Label:'});
        container.createEl('input');
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
                this.fileNameInput.value = this.file.name!;
            }
            input.remove();
        };

        document.body.appendChild(input);
        input.click();
    }

    async onClose(): Promise<void> {
        
    }
}