import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { DISTRIBUTE_NOTIFICATIONS, NOTIFY_USER } from './constants';
import distributeNotifications from './jobs/distributeNotifications';
import notifyUser from './jobs/notifyUser';
import IJobProcessor from './types/IJobProcessor';

export default class JobProcessor implements IJobProcessor {
  queues: Record<string, Queue>;
  workers: Record<string, Worker>;
  redis: Redis;

  constructor({
    queues,
    redis,
  }: {
    queues: Record<string, Queue>;
    redis: Redis;
  }) {
    this.queues = queues;
    this.workers = {};
    this.redis = redis;
    this.init();
  }

  private init() {
    const connection = this.redis;
    this.queues[DISTRIBUTE_NOTIFICATIONS] = new Queue(
      DISTRIBUTE_NOTIFICATIONS,
      {
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 100,
        },
        connection,
      },
    );

    this.workers[DISTRIBUTE_NOTIFICATIONS] = new Worker(
      DISTRIBUTE_NOTIFICATIONS,
      async () => {
        await distributeNotifications(this.queues);
      },
      {
        connection,
      },
    );

    this.queues[NOTIFY_USER] = new Queue(NOTIFY_USER, {
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
      },
      connection,
    });

    this.workers[NOTIFY_USER] = new Worker(NOTIFY_USER, notifyUser, {
      connection,
    });
  }

  async start() {
    await this.queues[DISTRIBUTE_NOTIFICATIONS].add(
      DISTRIBUTE_NOTIFICATIONS,
      {},
      {
        repeat: {
          every: 1000 * 60 * 1,
          limit: 100,
        },
      },
    );
  }
}
