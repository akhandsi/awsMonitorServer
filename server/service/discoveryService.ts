import * as AWS from "aws-sdk";
import {IRegionConfig} from '../models/model';
import {Region} from '../models/region/regionModel';
import {AWSAvailabilityZoneQuery} from '../queries/awsAvailabilityZoneQuery';
import {AWSInstanceQuery} from '../queries/awsInstanceQuery';
import {AWSRegionsQuery} from '../queries/awsRegionsQuery';
import {AWSVolumeQuery} from '../queries/awsVolumeQuery';
import {logger} from '../utils/logger';
import {AggregationService} from './aggregationService';
import {AWSDBInstanceQuery} from '../queries/awsDBInstanceQuery';

export class DiscoveryService {

    public static async collect(): Promise<Array<Region>> {

        // init aws-sdk
        AWS.config.setPromisesDependency(null);
        AWS.config.update({credentials: new AWS.SharedIniFileCredentials()});

        const regionQuery: AWSRegionsQuery = new AWSRegionsQuery();
        const availabilityZoneQuery: AWSAvailabilityZoneQuery = new AWSAvailabilityZoneQuery();
        const instanceQuery: AWSInstanceQuery = new AWSInstanceQuery();
        const volumeQuery: AWSVolumeQuery = new AWSVolumeQuery();
        const dbInstanceQuery: AWSDBInstanceQuery = new AWSDBInstanceQuery();

        // collect regions
        const regions: Region[] = await regionQuery.collect({region: 'us-west-2'});

        // collect zones
        const zonePromises = regions.map(async (region) => {
            const regionConfig: IRegionConfig = {region: region.name};
            return await availabilityZoneQuery.collect(regionConfig);
        });

        // collect instances
        const instancePromises = regions.map(async (region) => {
            const regionConfig: IRegionConfig = {region: region.name};
            return await instanceQuery.collect(regionConfig);
        });

        // collect volumes
        const volumePromises = regions.map(async (region) => {
            const regionConfig: IRegionConfig = {region: region.name};
            return await volumeQuery.collect(regionConfig);
        });

        // collect dbInstance
        const dbPromise = regions.map(async (region) => {
            const regionConfig: IRegionConfig = {region: region.name};
            return await dbInstanceQuery.collect(regionConfig) ;
        });

        // on all data retrieval, perform aggregation
        Promise.all([...zonePromises, ...instancePromises, ...volumePromises, ...dbPromise])
            .then(response => AggregationService.aggregate())
            .catch(e => logger.error(e));

        return regions.map(region => region.name);
    }
}
