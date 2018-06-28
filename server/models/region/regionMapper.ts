import * as AWS from "aws-sdk";
import {AbstractMapper} from "../mapper";
import {Region} from "./regionModel";

export class RegionMapper extends AbstractMapper<Region> {

    public toModel(region: AWS.EC2.Region): Region {
        const model: Region = new Region();
        model.name = region.RegionName || '';
        model.summary = {
            numOfDBInstances: 0,
            numOfInstances: 0,
            numOfUnattachedVolumes: 0,
            numOfZones: 0,
        };
        model.type = 'region';
        return model;
    }
}
