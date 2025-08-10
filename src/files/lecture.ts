import UnivresityPlugin from "main";
import { App } from "obsidian";
import { MetaHandler } from "./metaHandler";
import { TAdvancedFile } from "./metafile";

export class LecutreFileCreator extends MetaHandler
{
    constructor(app: App, plugin: UnivresityPlugin)
    {
        super(app,plugin);
    }

    async getFilesAsync(): Promise<Array<TAdvancedFile>> {
        await this.readMetaAsync();
        return this.metaData.files;
    }
}