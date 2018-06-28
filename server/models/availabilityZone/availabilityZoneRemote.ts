import * as mongoose from "mongoose";
import {Document, Model, Schema, ObjectId} from "mongoose";
import {logger} from "../../utils/logger";
import {AbstractRemote} from "../remote";
import {AvailabilityZone} from "./availabilityZoneModel";

type AvailabilityZoneDocument = AvailabilityZone & Document;

const AvailabilityZoneSchema: Model<AvailabilityZoneDocument> =
    mongoose.model<AvailabilityZoneDocument>("AvailabilityZone", new Schema({
        name: {
            required: true,
            type: String,
        },
        regionName: {
            required: true,
            type: String,
        },
        state: {
            required: true,
            type: String,
        },
        summary: {
            numOfInstances: {
                type: Number
            },
            numOfDBInstances: {
                type: Number
            },
            numOfUnattachedVolumes: {
                type: Number
            },
        },
        type: {
            required: true,
            type: String,
        },
    }));

export class AvailabilityZoneRemote implements AbstractRemote<AvailabilityZone> {

    public fetchAll(params: any = {}): Promise<Array<AvailabilityZone>> {
        return AvailabilityZoneSchema.find(params);
    }

    public fetchById(id: string): Promise<AvailabilityZone | null> {
        return AvailabilityZoneSchema.findOne({_id: AbstractRemote.validateId(id)});
    }

    public save(model: AvailabilityZone): void {
        AvailabilityZoneSchema
            .findOneAndUpdate({
                name: model.name,
            }, {
                $set: model,
            }, {
                upsert: true,
            })
            .then(zone => {
                if (zone) {
                    logger.info(`Saved Zone ${zone.name}`);
                }
            })
            .catch(err => logger.error(err));
    }

    public update(id: ObjectId, updateParams: any): void {
        AvailabilityZoneSchema
            .findOneAndUpdate({
                _id: id
            }, {
                $set: updateParams,
            }, {
                upsert: true,
            })
            .then(zone => {
                if (zone) {
                    logger.info(`Updated Zone ${zone.name}`);
                }
            })
            .catch(err => logger.error(err));
    }

    public aggregateNumOfInstancePerZone(): Promise<Array<any>> {
        return AvailabilityZoneSchema.aggregate([
            { $lookup: { from: 'instances', localField: 'name', foreignField: 'zoneName', as: 'data'} },
            { $unwind: '$data'},
            { $group: { _id: '$_id', numOfInstances: {$sum: 1} }}
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfInstances': doc.numOfInstances});
            });
        }).catch(e => logger.error(e));
    }

    public aggregateNumOfDBInstancePerZone(): Promise<Array<any>> {
        return AvailabilityZoneSchema.aggregate([
            { $lookup: { from: 'dbinstances', localField: 'name', foreignField: 'zoneName', as: 'data'} },
            { $unwind: '$data'},
            { $group: { _id: '$_id', numOfDBInstances: {$sum: 1} }}
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfDBInstances': doc.numOfDBInstances});
            });
        }).catch(e => logger.error(e));
    }

    public aggregateNumOfUnattachedVolumePerZone(): Promise<Array<any>> {
        return AvailabilityZoneSchema.aggregate([
            { $lookup: { from: 'volumes', localField: 'name', foreignField: 'zoneName', as: 'data'} },
            { $unwind: '$data'},
            { $match : { 'data.attachments' : {$eq: []}} },
            { $group: { _id: '$_id', numOfUnattachedVolumes: {$sum: 1} }}
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfUnattachedVolumes': doc.numOfUnattachedVolumes});
            });
        }).catch(e => logger.error(e));
    }
}
