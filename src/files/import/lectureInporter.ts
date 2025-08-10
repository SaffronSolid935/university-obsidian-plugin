import { WorkspaceLeaf } from "obsidian";
import { ImporterPopUpView } from "./importer";
import { LECTURES } from "src/view";
import UnivresityPlugin from "main";

export const VIEW_LECUTRE_IMPORTER = "view-lecutre-importer";

export class LectureImporterView extends ImporterPopUpView
{
    constructor(leaf: WorkspaceLeaf, plugin: UnivresityPlugin)
    {
        super(leaf,plugin);
        this.title = 'Import Lecture'
        this.sub = LECTURES;
        this.setFileHandler(plugin.lectureFileCreator);
    }

    getViewType(): string {
        return VIEW_LECUTRE_IMPORTER;
    }
}