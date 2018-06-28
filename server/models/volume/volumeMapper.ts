import * as AWS from "aws-sdk";
import {AbstractMapper} from "../mapper";
import {ITag, TagMapper} from "../tag";
import {Volume} from "./volumeModel";

export class VolumeMapper extends AbstractMapper<Volume> {

    public toModel(volume: AWS.EC2.Volume): Volume {
        // model tags
        const tags: ITag[] = TagMapper.toModels((volume.Tags || []));

        // find volume name
        const nameTag: ITag | undefined = TagMapper.findName(tags);
        const name: string | undefined = (nameTag) ? nameTag.value : volume.VolumeId;

        // create model
        const model: Volume = new Volume();
        model.attachments = (volume.Attachments || []).map(attachment => {
            return {
                device: attachment.Device,
                instanceId: attachment.InstanceId,
                state: attachment.State,
            };
        });
        model.name = name || '';
        model.volumeId = volume.VolumeId || '';
        model.volumeType = volume.VolumeType || 'Unknown';
        model.zoneName = volume.AvailabilityZone || '';
        model.size = volume.Size || 0;
        model.state = volume.State || 'Unknown';
        model.iops = volume.Iops || 0;
        model.tags = tags;
        model.type = 'volume';

        return model;
    }
}
