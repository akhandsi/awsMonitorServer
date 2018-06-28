import {IModel, IRegionConfig} from "../models/model";

export interface IAWSQuery<M extends IModel> {
    collect(region: IRegionConfig): Promise<M[]>;
}

/**
 * Abstract class to fetch entities from aws
 */
export abstract class AbstractAWSQuery<M extends IModel> implements IAWSQuery<M> {

    public abstract async collect(region: IRegionConfig): Promise<M[]>;
}




