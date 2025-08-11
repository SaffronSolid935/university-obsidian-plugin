import { TAdvancedFile } from "./metafile";
import { MetaHandler } from "./metaHandler";

export class ReadingFileCreator extends MetaHandler
{

    async getFilesAsync(): Promise<Array<TAdvancedFile>> {
        await this.readMetaAsync();
        return this.metaData.files;
    }
}