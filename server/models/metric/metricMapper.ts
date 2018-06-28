import {MetricDataResult} from "aws-sdk/clients/cloudwatch";
import {AbstractMapper} from "../mapper";
import {Metric} from "./metricModel";

export class MetricMapper extends AbstractMapper<Metric> {

    public toModel(metric: MetricDataResult): Metric {

        const model: Metric = new Metric();
        model.entityId = metric.Id || '';
        model.name = metric.Label || '';
        model.stats = [];

        if (metric.Values && metric.Timestamps) {
            const statsLength: number = (metric.Timestamps).length;
            for(let i = 0; i<statsLength; i++) {
                model.stats.push({
                    timestamp: new Date(metric.Timestamps[i]).getTime(),
                    value: metric.Values[i],
                });
            }
        }

        model.type = 'metric';

        return model;
    }
}
