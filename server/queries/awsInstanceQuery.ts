import * as AWS from "aws-sdk";
import * as _ from "lodash";

import {Instance} from "../models/instance/instanceModel";
import {IDimensionConfig, IRegionConfig} from "../models/model";
import {ReservationMapper} from "../models/reservation/reservationMapper";
import {Reservation} from "../models/reservation/reservationModel";
import {logger} from "../utils/logger";
import {AWSMetricQuery} from "./awsMetricsQuery";
import {AbstractAWSQuery} from './awsQuery';

export class AWSInstanceQuery implements AbstractAWSQuery<Instance> {

    private static fetchMetrics(region: IRegionConfig, models: Instance[]): void {

        const metricQuery: AWSMetricQuery = new AWSMetricQuery();
        models.map(model => {
            const dimension: IDimensionConfig =  {
                metrics: Instance.getMetricNames(),
                name: 'InstanceId',
                namespace: 'AWS/EC2',
                value: model.instanceId,
            };
            return metricQuery.collect(dimension, region)
                .catch(e => logger.error(e));
        });
    }

    public async collect(region: IRegionConfig): Promise<Instance[]> {
        try {

            // create ec2 client
            const ec2Client = new AWS.EC2(region);
            const instancesData: AWS.EC2.DescribeInstancesResult = await ec2Client.describeInstances({}).promise();

            // process instances
            const reservations: Reservation[] = new ReservationMapper().toModels((instancesData.Reservations || []));
            const models: Instance[] = _.flatten(reservations.map(reservation => reservation.instances));

            // collect all metrics for this region
            AWSInstanceQuery.fetchMetrics(region, models);

            return models;

        } catch (e) {

            logger.error(e);
            return [];
        }
    }
}
