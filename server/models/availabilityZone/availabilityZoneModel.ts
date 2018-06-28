import {PersistentModel} from "../model";
import {AvailabilityZoneRemote} from "./availabilityZoneRemote";

export class AvailabilityZone extends PersistentModel {
    public name: string;
    public state: string;
    public regionName: string;
    public summary: any;
    public type: string;

    public isValid(): boolean {
        return this.name !== '' && this.regionName !== '';
    }

    public save(): void {

        if (!this.isValid()) {
            return;
        }

        new AvailabilityZoneRemote().save(this);
    };
}


