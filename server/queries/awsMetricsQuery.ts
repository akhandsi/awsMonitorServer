import * as AWS from "aws-sdk";
import {GetMetricDataOutput, MetricDataQueries, MetricDataResult} from "aws-sdk/clients/cloudwatch";
import {Metric} from "../models/metric/metricModel";

import {MetricMapper} from "../models/metric/metricMapper";
import {logger} from "../utils/logger";

import {IDimensionConfig, IRegionConfig} from "../models/model";
import {AbstractAWSMetricQuery} from "./metricQuery";

export class AWSMetricQuery implements AbstractAWSMetricQuery<Metric> {

    private static prepareDataInput(dimension: IDimensionConfig): AWS.CloudWatch.GetMetricDataInput {
        const currentTime: number = new Date().getTime();
        const metricDataQueries: MetricDataQueries = dimension.metrics.map(metric => {
            return {
                Id: `${metric.name}`.toLowerCase(),
                MetricStat: {
                    Metric: {
                        Dimensions: [
                            {
                                Name: dimension.name,
                                Value: dimension.value,
                            },
                        ],
                        MetricName: metric.name,
                        Namespace: dimension.namespace,
                    },
                    Period: 300,
                    Stat: metric.stat,
                    Unit: metric.unit,
                },
                ReturnData: true,
            };
        });

        return {
            EndTime: new Date(currentTime),
            MetricDataQueries: metricDataQueries,
            StartTime: new Date(currentTime - 1800000),
        };
    }

    private static processMetrics(dimension: IDimensionConfig, metricData: GetMetricDataOutput): Metric[] {

        // process metrics
        const mapper: MetricMapper = new MetricMapper();
        const metricDataResult: MetricDataResult[] = (metricData.MetricDataResults || []).map(result => {
            return {
                Id: dimension.value,
                Label: result.Label,
                Timestamps: result.Timestamps,
                Values: result.Values,
            };
        });

        // convert to models and save
        return mapper.toModels(metricDataResult);
    }

    public async collect(dimension: IDimensionConfig, region: IRegionConfig): Promise<Metric[]> {

        try {

            // create cloudWatch client
            const cloudWatchClient: AWS.CloudWatch = new AWS.CloudWatch(region);
            const metricDataInput: AWS.CloudWatch.GetMetricDataInput = AWSMetricQuery.prepareDataInput(dimension);

            // collect all metrics for given region and dimension
            const metricData: GetMetricDataOutput = await cloudWatchClient.getMetricData(metricDataInput).promise();

            return AWSMetricQuery.processMetrics(dimension, metricData);

        } catch (e) {

            logger.error(e);
            return [];
        }
    }
}
