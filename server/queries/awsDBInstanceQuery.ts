import * as AWS from "aws-sdk";

import {DBInstanceMapper} from '../models/dbInstance/dbInstanceMapper';
import {DBInstance} from '../models/dbInstance/dbInstanceModel';
import {IDimensionConfig, IRegionConfig} from "../models/model";
import {logger} from "../utils/logger";
import {AWSMetricQuery} from "./awsMetricsQuery";
import {AbstractAWSQuery} from './awsQuery';

export class AWSDBInstanceQuery implements AbstractAWSQuery<DBInstance> {

    private static fetchMetrics(region: IRegionConfig, models: DBInstance[]): void {

        const metricQuery: AWSMetricQuery = new AWSMetricQuery();
        models.map(model => {
            const dimension: IDimensionConfig =  {
                metrics: DBInstance.getMetricNames(),
                name: 'DBInstanceIdentifier',
                namespace: 'AWS/RDS',
                value: model.instanceId,
            };
            return metricQuery.collect(dimension, region).catch(e => logger.error(e));
        });
    }

    public async collect(region: IRegionConfig): Promise<DBInstance[]> {
        try {

            // create rds client
            const rdsClient = new AWS.RDS(region);
            const dbInstancesData: AWS.RDS.DescribeDBInstancesMessage = await rdsClient.describeDBInstances({}).promise();

            // process instances
            const mapper: DBInstanceMapper = new DBInstanceMapper();
            const models: DBInstance[] = mapper.toModels((dbInstancesData.DBInstances || []));

            // find and save tags for each instance
            models
                .filter(model => model.instanceArn)
                .forEach(model => {
                    rdsClient.listTagsForResource({ResourceName: model.instanceArn})
                        .promise()
                        .then(response => mapper.saveTags(model, response.TagList))
                        .catch(e => logger.error(e));
                });

            // collect all metrics for this region
            AWSDBInstanceQuery.fetchMetrics(region, models);

            return models;

        } catch (e) {

            logger.error(e);
            return [];
        }
    }
}
