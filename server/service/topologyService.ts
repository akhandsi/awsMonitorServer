import {AvailabilityZone} from '../models/availabilityZone/availabilityZoneModel';
import {AvailabilityZoneRemote} from "../models/availabilityZone/availabilityZoneRemote";
import {DBInstance} from '../models/dbInstance/dbInstanceModel';
import {DBInstanceRemote} from '../models/dbInstance/dbInstanceRemote';
import {Instance} from '../models/instance/instanceModel';
import {InstanceRemote} from "../models/instance/instanceRemote";
import {Metric} from '../models/metric/metricModel';
import {MetricRemote} from '../models/metric/metricRemote';
import {IMetricInputDTO} from '../models/model';
import {Region} from '../models/region/regionModel';
import {RegionRemote} from '../models/region/regionRemote';
import {Volume} from '../models/volume/volumeModel';
import {VolumeRemote} from '../models/volume/volumeRemote';
import {logger} from '../utils/logger';

export class TopologyService {

    public static async getRegions(): Promise<Region[]> {
        return await new RegionRemote().fetchAll();
    }

    public static async getRegionById(regionId: string): Promise<Region> {
        return await new RegionRemote().fetchById(regionId);
    }

    public static async getZones(): Promise<AvailabilityZone[]> {
        return await new AvailabilityZoneRemote().fetchAll();
    }

    public static async getZoneById(zoneId: string): Promise<AvailabilityZone> {
        return await new AvailabilityZoneRemote().fetchById(zoneId);
    }

    public static async getZonesByRegion(regionId: string): Promise<AvailabilityZone[]> {
        const region: Region = await TopologyService.getRegionById(regionId);

        if (!region) {
            logger.info(`couldn't find region ${regionId}`);
            return Promise.reject([]);
        }

        return await new AvailabilityZoneRemote().fetchAll({regionName: region.name});
    }

    public static async getInstances(): Promise<Instance[]> {
        return await new InstanceRemote().fetchAll();
    }

    public static async getInstanceById(instanceId: string): Promise<Instance> {
        return await new InstanceRemote().fetchById(instanceId);
    }

    public static async getInstancesByRegion(regionId: string): Promise<Instance[]> {
        const zones: AvailabilityZone[] = await TopologyService.getZonesByRegion(regionId);

        if (!zones) {
            logger.info(`couldn't find zones for region ${regionId}`);
            return Promise.reject([]);
        }

        const promises: Array<Promise<Instance[]>> = zones.map(async (zone) => {
            return await TopologyService.getInstancesByZone(zone._id);
        });

        let models: Instance[] = [];
        for (const promise of promises) {
            models = models.concat(await promise);
        }
        return models;
    }

    public static async getInstancesByZone(zoneId: string): Promise<Instance[]> {
        const zone: AvailabilityZone = await TopologyService.getZoneById(zoneId);

        if (!zone) {
            logger.info(`couldn't find zone ${zoneId}`);
            return Promise.reject([]);
        }

        return await new InstanceRemote().fetchAll({zoneName: zone.name});
    }

    public static async getInstancesMetrics(instanceId: string, inputDTO: IMetricInputDTO): Promise<Metric[]> {
        const instance: Instance = await TopologyService.getInstanceById(instanceId);

        if (!instance) {
            logger.info(`couldn't find instance ${instanceId}`);
            return Promise.reject([]);
        }

        const dto = inputDTO ? inputDTO : {};
        return await new MetricRemote().fetchAll({
            entityId: instance.instanceId,
            ...dto
        });
    }

    public static async getDBInstances(): Promise<DBInstance[]> {
        return await new DBInstanceRemote().fetchAll();
    }

    public static async getDBInstanceById(dbInstanceId: string): Promise<DBInstance> {
        return await new DBInstanceRemote().fetchById(dbInstanceId);
    }

    public static async getDBInstancesByRegion(regionId: string): Promise<DBInstance[]> {
        const zones: AvailabilityZone[] = await TopologyService.getZonesByRegion(regionId);

        if (!zones) {
            logger.info(`couldn't find zones for region ${regionId}`);
            return Promise.reject([]);
        }

        const promises: Array<Promise<Instance[]>> = zones.map(async (zone) => {
            return await TopologyService.getDBInstancesByZone(zone._id);
        });

        let models: DBInstance[] = [];
        for (const promise of promises) {
            models = models.concat(await promise);
        }
        return models;
    }

    public static async getDBInstancesByZone(zoneId: string): Promise<DBInstance[]> {
        const zone: AvailabilityZone = await TopologyService.getZoneById(zoneId);

        if (!zone) {
            logger.info(`couldn't find zone ${zoneId}`);
            return Promise.reject([]);
        }

        return await new DBInstanceRemote().fetchAll({zoneName: zone.name});
    }

    public static async getDBInstancesMetrics(dbInstanceId: string, inputDTO: IMetricInputDTO): Promise<Metric[]> {
        const dbInstance: DBInstance = await TopologyService.getDBInstanceById(dbInstanceId);

        if (!dbInstance) {
            logger.info(`couldn't find instance ${dbInstanceId}`);
            return Promise.reject([]);
        }

        const dto = inputDTO ? inputDTO : {};
        return await new MetricRemote().fetchAll({
            entityId: dbInstance.instanceId,
            ...dto
        });
    }

    public static async getVolumes(): Promise<Volume[]> {
        return await new VolumeRemote().fetchAll();
    }

    public static async getVolumeById(volumeId: string): Promise<Volume> {
        return await new VolumeRemote().fetchById(volumeId);
    }

    public static async getVolumesByRegion(regionId: string): Promise<Volume[]> {
        const zones: AvailabilityZone[] = await TopologyService.getZonesByRegion(regionId);

        if (!zones) {
            logger.info(`couldn't find zones for region ${regionId}`);
            return Promise.reject([]);
        }

        const promises: Array<Promise<Volume[]>> = zones.map(async (zone) => {
            return await TopologyService.getVolumesByZone(zone._id);
        });

        let models: Volume[] = [];
        for (const promise of promises) {
            models = models.concat(await promise);
        }
        return models;
    }

    public static async getVolumesByZone(zoneId: string): Promise<Volume[]> {
        const zone: AvailabilityZone = await TopologyService.getZoneById(zoneId);

        if (!zone) {
            logger.info(`couldn't find zone ${zoneId}`);
            return Promise.reject([]);
        }

        return await new VolumeRemote().fetchAll({zoneName: zone.name, attachments: {$exists: true, $ne: []}});
    }

    public static async getUnattachedVolumesByRegion(regionId: string): Promise<Volume[]> {
        const zones: AvailabilityZone[] = await TopologyService.getZonesByRegion(regionId);

        if (!zones) {
            logger.info(`couldn't find zones for region ${regionId}`);
            return Promise.reject([]);
        }

        const promises: Array<Promise<Volume[]>> = zones.map(async (zone) => {
            return await TopologyService.getUnattachedVolumesByZone(zone._id);
        });

        let models: Instance[] = [];
        for (const promise of promises) {
            models = models.concat(await promise);
        }
        return models;
    }

    public static async getUnattachedVolumesByZone(zoneId: string): Promise<Volume[]> {
        const zone: AvailabilityZone = await TopologyService.getZoneById(zoneId);

        if (!zone) {
            logger.info(`couldn't find zone ${zoneId}`);
            return Promise.reject([]);
        }

        return await new VolumeRemote().fetchAll({zoneName: zone.name, attachments: {$exists: true, $eq: []}});
    }

    public static async getVolumesByInstance(instanceId: string): Promise<Volume[]> {
        const instance: Instance = await TopologyService.getInstanceById(instanceId);

        if (!instance) {
            logger.info(`couldn't find instance ${instanceId}`);
            return Promise.reject([]);
        }

        return await new VolumeRemote().fetchAll({"attachments.instanceId": instance.instanceId});
    }

    public static async getVolumeMetrics(volumeId: string, inputDTO: IMetricInputDTO): Promise<Metric[]> {
        const volume: Volume = await TopologyService.getVolumeById(volumeId);

        if (!volume) {
            logger.info(`couldn't find volume ${volumeId}`);
            return Promise.reject([]);
        }

        const dto = inputDTO ? inputDTO : {};
        return await new MetricRemote().fetchAll({
            entityId: volume.volumeId,
            ...dto
        });
    }
}
