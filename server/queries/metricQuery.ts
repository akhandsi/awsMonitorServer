import {IDimensionConfig, IModel, IRegionConfig} from "../models/model";

export interface IAWSMetricQuery<M extends IModel> {
    collect(dimension: IDimensionConfig, region: IRegionConfig): Promise<M[]>;
}

/**
 * Abstract class to fetch metrics from aws
 */
export abstract class AbstractAWSMetricQuery<M extends IModel> implements IAWSMetricQuery<M> {

    public abstract async collect(dimension: IDimensionConfig, region: IRegionConfig): Promise<M[]>;
}
