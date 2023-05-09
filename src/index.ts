import IORedis from 'ioredis';
import mongoose from 'mongoose';
import App from './App';
import JobProcessor from './JobProcessor';
import { apiPort, dbName, mongoseUrl, redisUri } from './config';
import BullBoardController from './controller/BullBoardController';
import PatientController from './controller/PatientController';
import dbSeeds from './dbSeeds';

(async () => {
  await mongoose.connect(mongoseUrl, {
    dbName: dbName,
  });

  mongoose.connection.on('error', (error) => {
    console.error({ msg: 'mongose_error', error });
  });

  const redis = new IORedis(redisUri, { maxRetriesPerRequest: null });
  const queues = {};

  const jobProcessor = new JobProcessor({ redis, queues });

  const app = new App({
    controllers: [
      new PatientController({ queues }),
      new BullBoardController({ queues }),
    ],
    port: apiPort,
  });

  await dbSeeds();
  await jobProcessor.start();
  app.listen();
})();
