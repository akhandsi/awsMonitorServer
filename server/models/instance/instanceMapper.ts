import * as AWS from "aws-sdk";
import {AbstractMapper} from "../mapper";
import {ITag, TagMapper} from "../tag";
import {Instance} from './instanceModel';

export class InstanceMapper extends AbstractMapper<Instance> {

    public toModel(instance: AWS.EC2.Instance): Instance {
        // model tags
        const tags: ITag[] = TagMapper.toModels((instance.Tags || []));

        // find instance name
        const nameTag: ITag | undefined = TagMapper.findName(tags);
        const name: string | undefined = (nameTag) ? nameTag.value : instance.InstanceId;

        // create model
        const model: Instance = new Instance();
        model.name = name || '';
        model.keyName = instance.KeyName || '';
        model.instanceId = instance.InstanceId || '';
        model.instanceType = instance.InstanceType || 'Unknown';
        model.monitoring = (instance.Monitoring) ? instance.Monitoring.State as any : '';
        model.zoneName = (instance.Placement) ? instance.Placement.AvailabilityZone || '' : '';
        model.tenancy = (instance.Placement) ? instance.Placement.Tenancy || '' : '';
        model.platform = instance.Platform || 'Unknown';
        model.ebsOptimized = instance.EbsOptimized || false;
        model.summary = {
            numOfVolumes: 0,
        };
        model.tags = tags;
        model.type = 'instance';

        return model;
    }
}
