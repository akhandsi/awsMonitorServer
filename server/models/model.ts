export interface IModel {
    name: string;
    type: string;
    save(): void;
    isValid(): boolean;
}

export abstract class PersistentModel implements IModel {
    public name: string;
    public type: string;
    public abstract save(): void;
    public abstract isValid(): boolean;
}

export interface IRegionConfig {
    region: string;
}

export interface IDimensionConfig {
    name: string;
    value: string;
    namespace: string;
    metrics: IMetricConfig[];
}

export interface IMetricConfig {
    name: string;
    unit: string;
    stat: string;
}

export interface IMetricInputDTO {
    startTime: number;
    endTime: number;
    name: string;
}
