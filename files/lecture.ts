import UnivresityPlugin from "main";
import { App } from "obsidian";
import { MetaHandler } from "./metaHandler";

export class LecutreFileCreator extends MetaHandler
{
    constructor(app: App, plugin: UnivresityPlugin)
    {
        super(app,plugin);
    }
}