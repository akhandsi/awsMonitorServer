import {Container} from 'inversify';
import "reflect-metadata";
import TYPES from './types';
import {DiscoveryController} from './controller/discoveryController';
import {TopologyController} from './controller/topologyController';
import {IRegistrableController} from './controller/controller';

const container = new Container();
container.bind<IRegistrableController>(TYPES.Controller).to(DiscoveryController);
container.bind<IRegistrableController>(TYPES.Controller).to(TopologyController);

export default container;
