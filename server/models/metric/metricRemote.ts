import * as mongoose from "mongoose";
import {Document, Model, Schema, ObjectId} from "mongoose";
import {logger} from "../../utils/logger";
import {AbstractRemote} from "../remote";
import {Metric} from "./metricModel";

type MetricDocument = Metric & Document;

const MetricSchema: Model<MetricDocument> =
    mongoose.model<MetricDocument>("Metric", new Schema({
        entityId: {
            required: true,
            type: String,
        },
        name: {
            required: true,
            type: String,
        },
        stats: [{
            timestamp: {
                required: true,
                type: Number,
            },
            value: {
                required: true,
                type: Number,
            },
        }],
        type: {
            required: true,
            type: String,
        },
    }));

export class MetricRemote implements AbstractRemote<Metric> {

    public fetchAll(params: any = {}): Promise<Array<Metric>> {
        if (!params.entityId) {
            return [];
        }

        if (!params.startTime && !params.endTime && !params.name) {
            return MetricSchema.find({entityId: params.entityId}, { stats: { $slice: 10 } });
        }

        return MetricSchema.aggregate([
            { $match: {entityId: params.entityId, name: params.name} },
            { $project: {
                    name: params.name,
                    type: 'metric',
                    stats: {
                        $filter: {
                            input: '$stats',
                            as: 'stat',
                            cond: {
                                $and: [
                                    {$gte: ['$$stat.timestamp', params.startTime]},
                                    {$lte: ['$$stat.timestamp', params.endTime]}
                                ],
                            },
                        },
                    },
                },
            },
        ]);
    }

    public fetchById(id: string): Promise<Metric | null> {
        return MetricSchema.findOne({_id: AbstractRemote.validateId(id)});
    }

    public save(model: Metric): void {
        MetricSchema
            .findOneAndUpdate(
                {entityId: model.entityId, name: model.name},
                {$addToSet: {stats: model.stats}, $set: {type: model.type}},
                {upsert: true}
            )
            .catch(err => logger.error(err));
    }

    public update(id: ObjectId, updateParams: any): void {
        MetricSchema
            .findOneAndUpdate(
                {_id: id},
                {$set: updateParams},
                {upsert: true}
            )
            .catch(err => logger.error(err));
    }
}
