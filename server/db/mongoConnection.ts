import * as mongoose from 'mongoose';
import {logger} from "../utils/logger";

export class MongoConnection {

    public static init(): void {

        const mongoURI: string | undefined = process.env.MONGODB_URI;

        if (!mongoURI) {
            logger.info('MONGODB_URI not found!!!');
            return;
        }

        (mongoose as any).Promise = global.Promise;
        mongoose.connect(mongoURI)
            .then(() => logger.info('Connected to MongoDB'))
            .catch(e => {
                process.exit(1);
                logger.info('Failed to Connect to MongoDB!!!', mongoURI);
            });
    }
}
