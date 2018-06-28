import * as AWS from "aws-sdk";
import {IRegionConfig} from "../models/model";
import {Region} from "../models/region/regionModel";

import {RegionMapper} from "../models/region/regionMapper";
import {AbstractAWSQuery} from "./awsQuery";

import {logger} from "../utils/logger";

export class AWSRegionsQuery implements AbstractAWSQuery<Region> {

    public async collect(region: IRegionConfig): Promise<Region[]> {
        try {
            const ec2Client = new AWS.EC2(region);
            const regionsJson: AWS.EC2.DescribeRegionsResult =
                await ec2Client.describeRegions({}).promise();

            const mapper: RegionMapper = new RegionMapper();
            return mapper.toModels((regionsJson.Regions || []));
            ec2Client.shu
        } catch (e) {
            logger.error(e);
            return [];
        }
    }
}
