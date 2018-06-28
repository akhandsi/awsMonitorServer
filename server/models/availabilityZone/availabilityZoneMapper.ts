import * as AWS from "aws-sdk";
import {AbstractMapper} from "../mapper";
import {AvailabilityZone} from "./availabilityZoneModel";

export class AvailabilityZoneMapper extends AbstractMapper<AvailabilityZone> {

    public toModel(zone: AWS.EC2.AvailabilityZone): AvailabilityZone {
        const model: AvailabilityZone = new AvailabilityZone();
        model.name = zone.ZoneName || '';
        model.regionName = zone.RegionName || '';
        model.state = zone.State || '';
        model.summary = {
            numOfDBInstances: 0,
            numOfInstances: 0,
            numOfUnattachedVolumes: 0,
        };
        model.type = 'zone';
        return model;
    }
}
