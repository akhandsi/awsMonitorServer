import * as express from 'express';
import {injectable} from 'inversify';
import {AvailabilityZone} from '../models/availabilityZone/availabilityZoneModel';
import {DBInstance} from '../models/dbInstance/dbInstanceModel';
import {Instance} from '../models/instance/instanceModel';
import {Metric} from '../models/metric/metricModel';
import {Region} from '../models/region/regionModel';
import {Volume} from '../models/volume/volumeModel';
import {TopologyService} from '../service/topologyService';

@injectable()
export class TopologyController {

    public register(app: express.Application): void {

        app.route('/regions')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Region[] = await TopologyService.getRegions()
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/region/:regionId/zones')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: AvailabilityZone[] = await TopologyService.getZonesByRegion(req.params.regionId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/region/:regionId/instances')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Instance[] = await TopologyService.getInstancesByRegion(req.params.regionId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/region/:regionId/dbInstances')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: DBInstance[] = await TopologyService.getDBInstancesByRegion(req.params.regionId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/region/:regionId/volumes')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Instance[] = await TopologyService.getVolumesByRegion(req.params.regionId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/region/:regionId/unattachedVolumes')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Volume[] = await TopologyService.getUnattachedVolumesByRegion(req.params.regionId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/zone/:zoneId/instances')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Instance[] = await TopologyService.getInstancesByZone(req.params.zoneId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/zone/:zoneId/dbInstances')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: DBInstance[] = await TopologyService.getDBInstancesByZone(req.params.zoneId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/zone/:zoneId/volumes')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Volume[] = await TopologyService.getVolumesByZone(req.params.zoneId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/zone/:zoneId/unattachedVolumes')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Volume[] = await TopologyService.getUnattachedVolumesByZone(req.params.zoneId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/instance/:instanceId/volumes')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Metric[] = await TopologyService.getVolumesByInstance(req.params.instanceId)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/instance/:instanceId/metrics')
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Metric[] = await TopologyService.getInstancesMetrics(req.params.instanceId, req.body.inputDTO)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/dbInstance/:dbInstanceId/metrics')
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Metric[] = await TopologyService.getDBInstancesMetrics(req.params.dbInstanceId, req.body.inputDTO)
                    .catch(err => next(err));
                res.send(models);
            });

        app.route('/volume/:volumeId/metrics')
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                const models: Metric[] = await TopologyService.getVolumeMetrics(req.params.volumeId, req.body.inputDTO)
                    .catch(err => next(err));
                res.send(models);
            });
    }
}
