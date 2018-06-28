import {PersistentModel} from "../model";
import {MetricRemote} from "./metricRemote";

export class Metric extends PersistentModel {
    public entityId: string;
    public name: string;
    public stats: Array<{timestamp: number, value: number}>;
    public type: string;

    public isValid(): boolean {
        return this.name !== '' && this.stats.length > 0;
    }

    public save(): void {

        if (!this.isValid()) {
            return;
        }

        new MetricRemote().save(this);
    }
}


