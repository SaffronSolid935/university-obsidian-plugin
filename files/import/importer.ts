import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

export const IMPORTER_POPUP_VIEW = "file-importer";

export class ImporterPopUpView extends ItemView
{
    protected title: string;
    protected sourcePath: string;
    constructor(leaf: WorkspaceLeaf)
    {
        super(leaf);
        this.title = 'Importer'
    }

    getViewType(): string {
        return IMPORTER_POPUP_VIEW;
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
        container.createEl('input');
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
                this.sourcePath = input.files.item(0)?.name!;
            }
            input.remove();
        };

        document.body.appendChild(input);
        input.click();
    }

    async onClose(): Promise<void> {
        
    }
}