import {IMetricConfig, PersistentModel} from "../model";
import {ITag} from "../tag";
import {VolumeRemote} from "./volumeRemote";

interface Attachment {
    device: string;
    instanceId: string;
    state: string;
}

export class Volume extends PersistentModel {
    public static getMetricNames(): IMetricConfig[] {
        return [
            {name: "VolumeTotalReadTime", unit: 'Seconds', stat: 'Average'},
            {name: "VolumeTotalWriteTime", unit: 'Seconds', stat: 'Average'},
            {name: "VolumeReadOps", unit: 'Count', stat: 'Sum'},
            {name: "VolumeWriteOps", unit: 'Count', stat: 'Sum'},
            {name: "VolumeReadBytes", unit: 'Bytes', stat: 'Sum'},
            {name: "VolumeWriteBytes", unit: 'Bytes', stat: 'Sum'},
        ];
    }

    public attachments: Attachment[];
    public name: string;
    public volumeId: string;
    public volumeType: string;
    public zoneName: string;
    public size: number;
    public state: string;
    public iops: number;
    public tags: ITag[];
    public type: string;

    public isValid(): boolean {
        return this.volumeId !== '' && this.zoneName !== '';
    }

    public save(): void {

        if (!this.isValid()) {
            return;
        }

        new VolumeRemote().save(this);
    };
}


