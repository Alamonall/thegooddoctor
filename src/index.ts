import IORedis from 'ioredis';
import mongoose from 'mongoose';
import App from './App';
import JobProcessor from './JobProcessor';
import { apiPort, mongoseUrl } from './config';
import BullBoardController from './controller/BullBoardController';
import PatientController from './controller/PatientController';
import dbSeeds from './dbSeeds';

(async () => {
  await mongoose.connect(mongoseUrl, {
    dbName: 'hospital',
  });

  mongoose.connection.on('error', (error) => {
    console.error(error);
  });

  const redis = new IORedis({ maxRetriesPerRequest: null });
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
