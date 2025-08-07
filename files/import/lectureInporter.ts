import { WorkspaceLeaf } from "obsidian";
import { ImporterPopUpView } from "./importer";

export const VIEW_LECUTRE_IMPORTER = "view-lecutre-importer";

export class LectureImporterView extends ImporterPopUpView
{
    constructor(leaf: WorkspaceLeaf)
    {
        super(leaf);
        this.title = 'Import Lecture'
    }
}