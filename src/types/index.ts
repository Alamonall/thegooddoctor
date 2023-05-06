import { Queue } from 'bullmq';
import express from 'express';

export interface IUser {
  phone: string;
  name: string;
}

export interface IDoctor {
  name: string;
  spec: string;
  slots: Array<Slot>;
  earliest_entry: Date;
}

export interface IExpressController {
  path: string;
  router: express.Router;
  queues: Record<string, Queue>;

  intializeRoutes: () => void;
}

export type Slot = {
  user_id?: number | null;
  date_time: Date;
  is_free: boolean;
  is_notified_before_two_hours: boolean;
  is_notified_before_one_day: boolean;
};
