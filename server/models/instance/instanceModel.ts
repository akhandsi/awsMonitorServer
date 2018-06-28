import {IMetricConfig, PersistentModel} from '../model';
import {InstanceRemote} from "./instanceRemote";

export class Instance extends PersistentModel {

    public static getMetricNames(): IMetricConfig[] {
        return [
            {name: "CPUUtilization", unit: 'Percent', stat: 'Average'},
            {name: "DiskReadBytes", unit: 'Bytes', stat: 'Average'},
            {name: "DiskWriteBytes", unit: 'Bytes', stat: 'Average'},
            {name: "NetworkIn", unit: 'Bytes', stat: 'Average'},
            {name: "NetworkOut", unit: 'Bytes', stat: 'Average'},
            {name: "DiskReadOps", unit: 'Count', stat: 'Sum'},
            {name: "DiskWriteOps", unit: 'Count', stat: 'Sum'},
            {name: "MemoryUsed", unit: 'Megabytes', stat: 'Average'}
        ];
    }

    public name: string;
    public keyName: string;
    public instanceId: string;
    public instanceType: string;
    public monitoring: string;
    public zoneName: string;
    public tenancy: string;
    public tags: any[];
    public platform: string;
    public ebsOptimized: boolean;
    public summary: any;
    public type: string;

    public isValid(): boolean {
        return this.instanceId !== '' && this.zoneName !== '';
    }

    public save(): void {

        if (!this.isValid()) {
            return;
        }

        new InstanceRemote().save(this);
    };
}
