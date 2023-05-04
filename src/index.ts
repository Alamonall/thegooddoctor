import IORedis from 'ioredis';
import mongoose from 'mongoose';
import App from './App';
import JobProcessor from './JobProcessor';
import { apiPort, mongoseUrl } from './config';
import PatientController from './controller/PatientController';

(async () => {
  await mongoose.connect(mongoseUrl, {
    dbName: 'hospital',
  });

  mongoose.connection.on('error', (error) => {
    console.error(error);
  });

  const redis = new IORedis();
  const queues = {};

  const jobProcessor = new JobProcessor({ redis, queues });

  const app = new App({
    controllers: [new PatientController({ queues })],
    port: apiPort,
  });

  await jobProcessor.start();
  app.listen();
})();
