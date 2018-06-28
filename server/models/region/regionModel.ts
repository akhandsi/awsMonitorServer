import {PersistentModel} from "../model";
import {RegionRemote} from "./regionRemote";

export class Region extends PersistentModel {
    public name: string;
    public summary: any;
    public type: string;

    public isValid(): boolean {
        return this.name !== '';
    }

    public save(): void {

        if (!this.isValid()) {
            return;
        }

        new RegionRemote().save(this);
    };
}


