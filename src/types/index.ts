import { Queue } from 'bullmq';
import express from 'express';

export interface IUser {
  phone: string;
  name: string;
}

export interface IDoctor {
  name: string;
  spec: string;
  slots: Array<{
    user_id: number;
    date_time: Date;
    is_free: boolean;
  }>;
}

export interface IExpressController {
  path: string;
  router: express.Router;
  queues: Record<string, Queue>;

  intializeRoutes: () => void;
}
