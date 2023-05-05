import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { Router } from 'express';
import { IExpressController } from '../types';

export default class BullBoardController implements IExpressController {
  path = '/admin/queues';
  serverAdapter = new ExpressAdapter();
  router: Router;
  queues: Record<string, Queue>;

  constructor({ queues }: { queues: Record<string, Queue> }) {
    this.queues = queues;
    this.intializeRoutes();
    this.serverAdapter.setBasePath('/admin/queues');

    this.router = this.serverAdapter.getRouter();
  }

  intializeRoutes() {
    const queuesAdapters = Object.values(this.queues).map((queue: Queue) => {
      return new BullAdapter(queue);
    });
    createBullBoard({
      queues: queuesAdapters,
      serverAdapter: this.serverAdapter,
    });
  }
}
