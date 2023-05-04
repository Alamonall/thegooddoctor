import bodyParser from 'body-parser';
import express from 'express';
import loggerMiddleware from './middleware/logger.middleware';
import { IExpressController } from './types';

export default class App {
  port: number;
  app: express.Application;

  constructor({
    controllers,
    port,
  }: {
    controllers: Array<IExpressController>;
    port: number;
  }) {
    this.port = port;

    this.app = express();
    this.initMiddlewares();
    this.initializeControllers(controllers);
  }

  public initMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(loggerMiddleware);
  }

  private initializeControllers(controllers: Array<IExpressController>) {
    controllers.forEach((controller: IExpressController) => {
      const route = `/api/v1${controller.path}`;
      this.app.use(route, controller.router);
      console.log(`init route: ${route}`);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.debug('listening on port ' + this.port);
    });
  }
}
