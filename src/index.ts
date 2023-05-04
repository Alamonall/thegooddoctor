import express from 'express';
import mongoose from 'mongoose';
import { apiPort, mongoseUrl } from './config';
import patient from './controller/patient';
import databaseSeeds from './dbSeeds';

const app = express();

console.log({ mongoseUrl });

mongoose.connection.on('error', (error) => {
  console.error(error);
});

app.use('*', patient);

(async () => {
  await mongoose.connect(mongoseUrl);
  await databaseSeeds();

  app.listen(apiPort);
})();
