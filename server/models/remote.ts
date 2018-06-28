import * as mongoose from "mongoose";
import {ObjectId} from "mongoose";
import {IModel} from "./model";

interface IRemote<M extends IModel> {
    fetchById(id: string): Promise<M | null>;
    fetchAll(params: any = {}): Promise<M[]>;
    save(model: M): void
    update(model: M, updateParams: any): void
}

export abstract class AbstractRemote<M extends IModel> implements IRemote<M> {

    public abstract fetchById(id: string): Promise<M | null>;

    public abstract fetchAll(params: any = {}): Promise<M[]>;

    public abstract save(model: M): void;

    public abstract update(id: ObjectId, updateParams: any): void;

    public static validateId(id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId(id.toString().trim());
    }
}
