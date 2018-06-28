import {IMetricConfig, PersistentModel} from '../model';
import {ITag} from "../tag";
import {DBInstanceRemote} from "./dbInstanceRemote";

export class DBInstance extends PersistentModel {

    public static getMetricNames(): IMetricConfig[] {
        return [
            {name: "CPUUtilization", unit: 'Percent', stat: 'Average'},
            {name: "DatabaseConnections", unit: 'Count', stat: 'Average'},
            {name: "FreeStorageSpace", unit: 'Bytes', stat: 'Average'},
            {name: "FreeableMemory", unit: 'Bytes', stat: 'Average'},
            {name: "ReadThroughput", unit: 'Bytes', stat: 'Average'},
            {name: "WriteThroughput", unit: 'Bytes', stat: 'Average'},
        ];
    }

    public name: string;
    public instanceId: string;
    public instanceType: string;
    public instanceArn: string;
    public status: string;
    public zoneName: string;
    public storageType: string;
    public engine: string;
    public engineVersion: string;
    public allocatedStorage: number;
    public iops: number;
    public summary: any;
    public tags: ITag[];
    public type: string;

    public isValid(): boolean {
        return this.instanceId !== '' && this.zoneName !== '';
    }

    public save(): void {

        if (!this.isValid()) {
            return;
        }

        new DBInstanceRemote().save(this);
    };
}
