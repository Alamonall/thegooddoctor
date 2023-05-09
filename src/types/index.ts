import { Queue } from 'bullmq';
import express from 'express';

export interface IUser {
  _id: string;
  phone: string;
  name: string;
}

export interface IDoctor {
  _id: string;
  name: string;
  spec: string;
  slots: Array<Slot>;
  earliest_entry: Date | null;
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

export type NotifyUserJob = {
  doctorId: string;
  slot_date_time: Date;
  type: 'daily' | 'hourly';
};
