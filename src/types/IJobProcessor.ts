import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

export default interface IJobProcessor {
  queues: Record<string, Queue>;
  workers: Record<string, Worker>;
  redis: Redis;
}
