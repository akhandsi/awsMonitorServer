import {IModel} from "./model";

interface IMapper<M extends IModel> {

    toModels(dtos: any[]): M[];

    toModel(dto: any, existing?: M): M;
}

export abstract class AbstractMapper<M extends IModel> implements IMapper<M> {

    public abstract toModel(dto: any, existing?: M): M;

    /**
     * by default lets persist all the models
     * @param {any[]} dtos
     * @return {M[]}
     */
    public toModels(dtos: any[]): M[] {
        // convert to model
        const models: M[] = (dtos || [])
            .map(dto => this.toModel(dto))
            .filter(model => model.isValid());

        // persist
        models.forEach(model => model.save());

        return models;
    }
}
