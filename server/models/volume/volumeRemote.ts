import * as mongoose from "mongoose";
import {Document, Model, Schema, ObjectId} from "mongoose";
import {logger} from "../../utils/logger";
import {AbstractRemote} from "../remote";
import {Volume} from "./volumeModel";

type VolumeDocument = Volume & Document;

const VolumeSchema: Model<VolumeDocument> =
    mongoose.model<VolumeDocument>("Volume", new Schema({
        attachments: [{
            device: {
                required: true,
                type: String,
            },
            instanceId: {
                required: true,
                type: String,
            },
            state: {
                required: true,
                type: String,
            }
        }],
        iops: {
            required: true,
            type: Number,
        },
        name: {
            required: true,
            type: String,
        },
        size: {
            required: true,
            type: Number,
        },
        state: {
            required: true,
            type: String,
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
        volumeId: {
            required: true,
            type: String,
            unique: true,
        },
        volumeType: {
            required: true,
            type: String,
        },
        zoneName: {
            required: true,
            type: String,
        },
    }));

export class VolumeRemote implements AbstractRemote<Volume> {

    public fetchAll(params: any = {}): Promise<Volume[]> {
        return VolumeSchema.find(params);
    }

    public fetchById(id: string): Promise<Volume | null> {
        return VolumeSchema.findOne({_id: AbstractRemote.validateId(id)});
    }

    public save(model: Volume): void {

        VolumeSchema
            .findOneAndUpdate({
                volumeId: model.volumeId,
            }, {
                $set: model,
            }, {
                upsert: true,
            })
            .then(volume => {
                if (volume) {
                    logger.info(`Saved Volume ${volume.name}`);
                }
            })
            .catch(err => logger.error(err));
    };

    public update(id: ObjectId, updateParams: any): void {
        VolumeSchema
            .findOneAndUpdate({
                _id: id
            }, {
                $set: updateParams,
            }, {
                upsert: true,
            })
            .then(volume => {
                if (volume) {
                    logger.info(`Updated Volume ${volume.name}`);
                }
            })
            .catch(err => logger.error(err));
    }
}
