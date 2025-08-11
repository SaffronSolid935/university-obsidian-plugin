import { WorkspaceLeaf } from "obsidian";
import { ImporterPopUpView } from "./importer";
import { READINGS } from "src/view";
import UnivresityPlugin from "main";

/**
 * The id of the reading importer.
 */
export const VIEW_READING_IMPORTER = "view-reading-importer";


/**
 * A standardized importer view for readings. 
 */
export class ReadingImporterView extends ImporterPopUpView
{
    constructor(leaf: WorkspaceLeaf, plugin: UnivresityPlugin)
    {
        super(leaf,plugin);
        this.title = 'Import Reading'
        this.sub = READINGS;
        this.setFileHandler(plugin.readingFileCreator);
    }

    getViewType(): string {
        return VIEW_READING_IMPORTER;
    }
}