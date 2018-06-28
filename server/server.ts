import * as express from 'express';
import * as bodyParser from 'body-parser';
import TYPES from './types';
import container from './inversify.config';
import {logger} from './utils/logger';
import {Config} from './config/config';
import {MongoConnection} from './db/mongoConnection';
import {IRegistrableController} from './controller/controller';

Config.init();
MongoConnection.init();

const app: express.Application = express();
app.use(bodyParser.json());

// register all endpoints from Ioc controllers
const controllers: RegistrableController[] = container.getAll<IRegistrableController>(TYPES.Controller);
controllers.forEach(controller => controller.register(app));

app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.error(err.stack);
    next(err);
});

app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(500).send('Internal Server Error');
});

app.listen(3001, function () {
    logger.info('Example app listening on port 3001!');
});
