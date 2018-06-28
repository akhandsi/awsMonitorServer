import {CronJob} from 'cron';
import * as express from 'express';
import {injectable} from 'inversify';
import {DiscoveryService} from '../service/discoveryService';
import {logger} from '../utils/logger';

@injectable()
export class DiscoveryController implements RegistrableController {

    private discoveringProcess: CronJob;

    public register(app: express.Application): void {

        // start discovery on registering
        this.discover();

        // register the routes
        app.route('/discover')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                this.discover();
                res.send('');
            });
    }

    public discover(): void {

        // create new discoveringProcess
        if (!this.discoveringProcess) {
            this.discoveringProcess = new CronJob({
                cronTime: '*/30 * * * *',
                onTick: this.onDiscoveryRun.bind(this),
                runOnInit: true,
            });
        }

        // prevent running multiple discoveries on cron
        if (this.discoveringProcess.running) {
            logger.info('Discovery already in progress');
            return;
        }

        // start discovery process
        this.discoveringProcess.start();
    }

    private onDiscoveryRun(): void {

        logger.info('-----------------------------------------------');
        logger.info(`Discovery - starting to collect all information at ${new Date()}`);
        logger.info('-----------------------------------------------');

        // collect all the data
        DiscoveryService.collect().catch(err => logger.error(err));

        // stop the process
        if (this.discoveringProcess) {
            this.discoveringProcess.stop();
        }
    }
}
