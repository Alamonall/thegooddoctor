import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { NOTIFY_USER } from './constants';
import notifyUser from './jobs/notifyUser';

export default class JobProcessor {
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
    await this.queues[NOTIFY_USER].add(
      NOTIFY_USER,
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
