import * as mongoose from "mongoose";
import {Document, Model, Schema, ObjectId} from "mongoose";
import {logger} from "../../utils/logger";
import {AbstractRemote} from "../remote";
import {DBInstance} from "./dbInstanceModel";

type IDBInstanceDocument = DBInstance & Document;

const DBInstanceSchema: Model<IDBInstanceDocument> =
    mongoose.model<IDBInstanceDocument>("DBInstance", new Schema({
        allocatedStorage:{
          type: Number,
        },
        engine: {
            required: true,
            type: String,
        },
        engineVersion: {
            required: true,
            type: String,
        },
        instanceArn: {
            type: String,
        },
        instanceId: {
            required: true,
            type: String,
            unique: true,
        },
        instanceType: {
            required: true,
            type: String,
        },
        iops: {
            type: Number,
        },
        name: {
            required: true,
            type: String,
        },
        storageType: {
            required: true,
            type: String,
        },
        status: {
            required: true,
            type: String,
        },
        summary: {
            numOfVolumes: {
                type: Number
            },
        },
        tags: [{
            key: {
                required: true,
                type: String,
            },
            value: {
                required: true,
                type: String,
            }
        }],
        type: {
            required: true,
            type: String,
        },
        zoneName: {
            required: true,
            type: String,
        },
    }));

export class DBInstanceRemote implements AbstractRemote<DBInstance> {

    public fetchAll(params: any = {}): Promise<Array<DBInstance>> {
        return DBInstanceSchema.find(params);
    }

    public fetchById(id: string): Promise<DBInstance | null> {
        return DBInstanceSchema.findOne({_id: AbstractRemote.validateId(id)});
    }

    public save(model: DBInstance): void {
        DBInstanceSchema
            .findOneAndUpdate({
                instanceId: model.instanceId,
            }, {
                $set: model,
            }, {
                upsert: true,
            })
            .then(instance => {
                if (instance) {
                    logger.info(`Saved DbInstance ${instance.name}`);
                }
            })
            .catch(err => logger.error(err));
    }

    public update(id: ObjectId, updateParams: any): void {
        DBInstanceSchema
            .findOneAndUpdate({
                _id: id,
            }, {
                $set: updateParams,
            }, {
                upsert: true,
            })
            .then(instance => {
                if (instance) {
                    logger.info(`Updated DbInstance ${instance.name}`);
                }
            })
            .catch(err => logger.error(err));
    }
}
