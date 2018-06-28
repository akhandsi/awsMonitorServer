import {Instance} from "../instance/instanceModel";
import {PersistentModel} from "../model";

export class Reservation extends PersistentModel {
    public instances: Instance[];
    public reservationId: string;
    public name: string;
    public type: string;

    public isValid(): boolean {
        return this.reservationId !== '';
    }

    public save(): void {

        if (!this.isValid()) {
            return;
        }

        // nothing yet
    }
}

