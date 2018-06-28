import * as AWS from "aws-sdk";
import {IDimensionConfig, IRegionConfig} from "../models/model";
import {VolumeMapper} from "../models/volume/volumeMapper";
import {Volume} from "../models/volume/volumeModel";
import {logger} from "../utils/logger";
import {AWSMetricQuery} from "./awsMetricsQuery";
import {AbstractAWSQuery} from './awsQuery';

export class AWSVolumeQuery implements AbstractAWSQuery<Volume> {

    private static fetchMetrics(region: IRegionConfig, models: Volume[]): void {

        const metricQuery: AWSMetricQuery = new AWSMetricQuery();
        models.map(model => {
            const dimension: IDimensionConfig =  {
                metrics: Volume.getMetricNames(),
                name: 'VolumeId',
                namespace: 'AWS/EBS',
                value: model.volumeId,
            };
            return metricQuery.collect(dimension, region).catch(e => logger.error(e));
        });
    }

    public async collect(region: IRegionConfig): Promise<Volume[]> {
        try {

            // create ec2 client
            const ec2Client = new AWS.EC2(region);
            const volumes: AWS.EC2.DescribeVolumesResult = await ec2Client.describeVolumes({}).promise();

            // process instances
            const mapper: VolumeMapper = new VolumeMapper();
            const models: Volume[] = mapper.toModels((volumes.Volumes || []));

            // collect all metrics for this region
            AWSVolumeQuery.fetchMetrics(region, models);

            return models;

        } catch (e) {

            logger.error(e);
            return [];
        }
    }
}
