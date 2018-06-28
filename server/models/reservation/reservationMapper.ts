import * as AWS from "aws-sdk";
import {InstanceMapper} from "../instance/instanceMapper";
import {AbstractMapper} from "../mapper";
import {Reservation} from "./reservationModel";

export class ReservationMapper extends AbstractMapper<Reservation> {

    public toModel(reservation: AWS.EC2.Reservation): Reservation {
        const instanceMapper: InstanceMapper = new InstanceMapper();
        const model: Reservation = new Reservation();
        model.name = '';
        model.instances = instanceMapper.toModels((reservation.Instances || []));
        model.reservationId = reservation.ReservationId || '';
        model.type = 'reservation';

        return model;
    }
}
