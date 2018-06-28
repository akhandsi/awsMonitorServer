import * as mongoose from "mongoose";
import {Document, Model, Schema, ObjectId} from "mongoose";
import {logger} from "../../utils/logger";
import {AbstractRemote} from "../remote";
import {Region} from "./regionModel";

type RegionDocument = Region & Document;

const RegionSchema: Model<RegionDocument> =
    mongoose.model<RegionDocument>("Region", new Schema({
        name: {
            required: true,
            type: String,
            unique: true,
        },
        summary: {
            numOfZones: {
                type: Number
            },
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

export class RegionRemote implements AbstractRemote<Region> {

    public fetchAll(params: any = {}): Promise<Array<Region>> {
        return RegionSchema.find(params);
    }

    public fetchById(id: string): Promise<Region | null> {
        return RegionSchema.findOne({_id: AbstractRemote.validateId(id)});
    }

    public save(model: Region): void {
        RegionSchema
            .findOneAndUpdate({
                name: model.name,
            }, {
                $set: model,
            }, {
                upsert: true,
            })
            .then(region => {
                if (region) {
                    logger.info(`Saved Region ${region.name}`);
                }
            })
            .catch(err => logger.error(err));
    }

    public update(id: ObjectId, updateParams: any): void {
        RegionSchema
            .findOneAndUpdate({
                _id: id
            }, {
                $set: updateParams,
            }, {
                upsert: true,
            })
            .then(region => {
                if (region) {
                    logger.info(`Updated Region ${region.name}`);
                }
            })
            .catch(err => logger.error(err));
    }

    public aggregateNumOfZonePerRegion(): Promise<Array<any>> {
        return RegionSchema.aggregate([
            { $lookup: { from: 'availabilityzones', localField: 'name', foreignField: 'regionName', as: 'zone'} },
            { $unwind: '$zone'},
            { $group: { _id: '$_id', numOfZones: {$sum: 1} }}
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfZones': doc.numOfZones});
            });
        }).catch(e => logger.error(e));
    }

    public aggregateNumOfInstancePerRegion(): Promise<Array<any>> {
        return RegionSchema.aggregate([
            { $lookup: { from: 'availabilityzones', localField: 'name', foreignField: 'regionName', as: 'zone'} },
            { $unwind: '$zone'},
            { $lookup: { from: 'instances', localField: 'zone.name', foreignField: 'zoneName', as: 'instance'} },
            { $unwind: '$instance'},
            { $group: {  _id: '$_id', numOfInstances: {$sum: 1}}},
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfInstances': doc.numOfInstances});
            });
        }).catch(e => logger.error(e));
    }

    public aggregateNumOfDBInstancePerRegion(): Promise<Array<any>> {
        return RegionSchema.aggregate([
            { $lookup: { from: 'availabilityzones', localField: 'name', foreignField: 'regionName', as: 'zone'} },
            { $unwind: '$zone'},
            { $lookup: { from: 'dbinstances', localField: 'zone.name', foreignField: 'zoneName', as: 'dbinstance'} },
            { $unwind: '$dbinstance'},
            { $group: {  _id: '$_id', numOfDBInstances: {$sum: 1}}},
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfDBInstances': doc.numOfDBInstances});
            });
        }).catch(e => logger.error(e));
    }

    public aggregateNumOfUnattachedVolumePerRegion(): Promise<Array<any>> {
        return RegionSchema.aggregate([
            { $lookup: { from: 'availabilityzones', localField: 'name', foreignField: 'regionName', as: 'zone'} },
            { $unwind: '$zone'},
            { $lookup: { from: 'volumes', localField: 'zone.name', foreignField: 'zoneName', as: 'volume'} },
            { $unwind: '$volume'},
            { $match : { 'volume.attachments' : {$eq: []}} },
            { $group: { _id: '$_id', numOfUnattachedVolumes: {$sum: 1} }}
        ]).then(res => {
            res.forEach(doc => {
                this.update(doc._id, {'summary.numOfUnattachedVolumes': doc.numOfUnattachedVolumes});
            });
        }).catch(e => logger.error(e));
    }
}
