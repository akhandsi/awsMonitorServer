import {AvailabilityZoneRemote} from '../models/availabilityZone/availabilityZoneRemote';
import {InstanceRemote} from '../models/instance/instanceRemote';
import {logger} from "../utils/logger";
import {RegionRemote} from '../models/region/regionRemote';

export class AggregationService {

    public static aggregate(): void {
        const regionRemote: RegionRemote = new RegionRemote();
        const availabilityZoneRemote: AvailabilityZoneRemote = new AvailabilityZoneRemote();
        const instanceRemote: InstanceRemote = new InstanceRemote();

        regionRemote.aggregateNumOfZonePerRegion().catch(e => logger.error(e));
        regionRemote.aggregateNumOfInstancePerRegion().catch(e => logger.error(e));
        regionRemote.aggregateNumOfDBInstancePerRegion().catch(e => logger.error(e));
        regionRemote.aggregateNumOfUnattachedVolumePerRegion().catch(e => logger.error(e));
        availabilityZoneRemote.aggregateNumOfInstancePerZone().catch(e => logger.error(e));
        availabilityZoneRemote.aggregateNumOfDBInstancePerZone().catch(e => logger.error(e));
        availabilityZoneRemote.aggregateNumOfUnattachedVolumePerZone().catch(e => logger.error(e));
        instanceRemote.aggregateNumOfVolumesPerInstance().catch(e => logger.error(e));
    }
}
