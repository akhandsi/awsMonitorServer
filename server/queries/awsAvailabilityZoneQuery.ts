import * as AWS from "aws-sdk";
import {AvailabilityZoneMapper} from "../models/availabilityZone/availabilityZoneMapper";
import {AvailabilityZone} from "../models/availabilityZone/availabilityZoneModel";
import {AbstractAWSQuery} from "./awsQuery";

import {logger} from "../utils/logger";

import {IRegionConfig} from "../models/model";

export class AWSAvailabilityZoneQuery implements AbstractAWSQuery<AvailabilityZone> {

    public async collect(region: IRegionConfig): Promise<AvailabilityZone[]> {
        try {

            const ec2Client = new AWS.EC2(region);
            const zones: AWS.EC2.DescribeAvailabilityZonesResult =
                await ec2Client.describeAvailabilityZones({}).promise();

            const mapper: AvailabilityZoneMapper = new AvailabilityZoneMapper();
            return mapper.toModels((zones.AvailabilityZones || []));

        } catch (e) {

            logger.error(e);
            return [];
        }
    }
}
