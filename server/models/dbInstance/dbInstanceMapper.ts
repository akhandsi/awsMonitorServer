import * as AWS from "aws-sdk";
import {AbstractMapper} from "../mapper";
import {TagMapper} from "../tag";
import {DBInstance} from './dbInstanceModel';

export class DBInstanceMapper extends AbstractMapper<DBInstance> {

    public toModel(dbInstance: AWS.RDS.DBInstance): DBInstance {
        // create model
        const model: DBInstance = new DBInstance();
        model.name = dbInstance.DBName || '';
        model.instanceId = dbInstance.DBInstanceIdentifier || '';
        model.instanceType = dbInstance.DBInstanceClass || 'Unknown';
        model.instanceArn = dbInstance.DBInstanceArn;
        model.zoneName = dbInstance.AvailabilityZone || '';
        model.status = dbInstance.DBInstanceStatus;
        model.engine = dbInstance.Engine;
        model.engineVersion = dbInstance.EngineVersion;
        model.storageType = dbInstance.StorageType;
        model.allocatedStorage = dbInstance.AllocatedStorage;
        model.iops = dbInstance.Iops;
        model.summary = {};
        model.tags = [];
        model.type = 'dbInstance';

        return model;
    }

    public saveTags(model: DBInstance, tagList: TagList) {
        model.tags = TagMapper.toModels((tagList || []));
        model.save();
    }
}
