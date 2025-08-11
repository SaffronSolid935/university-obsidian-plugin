import { TFile } from "obsidian";

/**
 * Defines the objects structure of a meta file.
 */
export interface IMetaFile
{
    /**
     * Contains file information.
     */
    files: Array<TAdvancedFile>;
}

/**
 * This class give the meta data object some additional methods.
 */
export class MetaFile implements IMetaFile
{
    files: TAdvancedFile[];
    constructor()
    {
        this.files = [];
    }

    /**
     * Creates the object of type MetaFile from a simple object ({}).
     */
    public static fromObject(data: IMetaFile)
    {
        let metaData = new MetaFile();
        metaData.files = data.files;
        for (let i = 0; i < metaData.files.length; i++)
        {
            metaData.files[i].date = new Date(metaData.files[i].date);
        }
        return metaData;
    }

    /**
     * Returns the highest index in the meta file, for incremental index increase.
     * @returns 
     */
    public getHighestIndex() : number
    {
        let highest = -1;
        for (var i = 0; i < this.files.length; i++)
        {
            if (this.files[i].index > highest)
            {
                highest = this.files[i].index;
            }
        }
        return highest;
    }

    /**
     * Sorts the files by the index.
     */
    sortByIndex(desc: boolean)
    {
        this.files.sort((a,b)=>{
            let returnValue = 0;
            if (a && b)
            {
                returnValue = a.index - b.index
            }
            else if (a)
            {
                returnValue = -1;
            }
            else if (b)
            {
                returnValue = 1;
            }
            
            return returnValue * (desc ? -1 : 1);
        });
    }

    /**
     * Sorts the file by the date (newest first)
     */
    sortByDate()
    {
        this.files.sort((a,b)=>{
            const dateA = a.date;
            const dateB = b.date;

            if (dateA && dateB)
            {
                return dateB.getDate() - dateA.getDate();
            }
            return 0;
        });
    }
}

/**
 * This class defines a file by filename, path, extension, basename (like TFile) but has also a property for label, date and index. 
 */
export class TAdvancedFile
{
    basename: string;
    extension: string;
    name: string;
    path: string;
    constructor(file: TFile | null)
    {
        if (file)
        {
            this.basename = file.basename;
            this.extension = file.extension;
            this.name = file.name;
            this.path = file.path;
        }
    }

    label: string;
    index: number;
    date: Date;

    /**
     * It sets the new index of the file. It needs the highest existing index. Not a non existing one.s
     */
    public setIndexByPreIndex(preIndex: number)
    {
        this.index = preIndex + 1;
    }
}