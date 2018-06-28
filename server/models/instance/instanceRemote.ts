import * as mongoose from "mongoose";
import {Document, Model, Schema, ObjectId} from "mongoose";
import {logger} from "../../utils/logger";
import {AbstractRemote} from "../remote";
import {Instance} from "./instanceModel";

type IInstanceDocument = Instance & Document;

const InstanceSchema: Model<IInstanceDocument> =
    mongoose.model<IInstanceDocument>("Instance", new Schema({
        ebsOptimized: {
            required: true,
            type: Boolean,
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
        keyName: {
            required: false,
            type: String,
        },
        monitoring: {
            required: true,
            type: String,
        },
        name: {
            required: true,
            type: String,
        },
        platform: {
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
        tenancy: {
            required: true,
            type: String,
        },
        type: {
            required: true,
            type: String,
        },
        zoneName: {
            required: true,
            type: String,
        },
    }));

export class InstanceRemote implements AbstractRemote<Instance> {

    public fetchAll(params: any = {}): Promise<Array<Instance>> {
        return InstanceSchema.find(params);
    }

    public fetchById(id: string): Promise<Instance | null> {
        return InstanceSchema.findOne({_id: AbstractRemote.validateId(id)});
    }

    public save(model: Instance): void {
        InstanceSchema
            .findOneAndUpdate({
                instanceId: model.instanceId,
            }, {
                $set: model,
            }, {
                upsert: true,
            })
            .then(instance => {
                if (instance) {
                    logger.info(`Saved Instance ${instance.name}`);
                }
            })
            .catch(err => logger.error(err));
    }

    public update(id: ObjectId, updateParams: any): void {
        InstanceSchema
            .findOneAndUpdate({
                _id: id,
            }, {
                $set: updateParams,
            }, {
                upsert: true,
            })
            .then(instance => {
                if (instance) {
                    logger.info(`Updated Instance ${instance.name}`);
                }
            })
            .catch(err => logger.error(err));
    }

    public aggregateNumOfVolumesPerInstance(): Promise<Array<any>> {
        return InstanceSchema.aggregate([
            { $lookup: {from: 'volumes', localField: 'instanceId',foreignField: 'attachments.instanceId', as: 'data'} },
            { $unwind: '$data'},
            { $group: { _id: '$_id', numOfVolumes: {$sum: 1} }}
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfVolumes': doc.numOfVolumes});
            });
        }).catch(e => logger.error(e));
    }
}
