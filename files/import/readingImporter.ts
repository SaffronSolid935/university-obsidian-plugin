import { WorkspaceLeaf } from "obsidian";
import { ImporterPopUpView } from "./importer";
import { READINGS } from "view";
import UnivresityPlugin from "main";

export const VIEW_READING_IMPORTER = "view-reading-importer";

export class ReadingImporterView extends ImporterPopUpView
{
    constructor(leaf: WorkspaceLeaf, plugin: UnivresityPlugin)
    {
        super(leaf,plugin);
        this.title = 'Reading Lecture'
        this.sub = READINGS;
        this.setFileHandler(plugin.readingFileCreator);
    }

    getViewType(): string {
        return VIEW_READING_IMPORTER;
    }
}