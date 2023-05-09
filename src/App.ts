import bodyParser from 'body-parser';
import express from 'express';
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
  }

  private initializeControllers(controllers: Array<IExpressController>) {
    controllers.forEach((controller: IExpressController) => {
      this.app.use(controller.path, controller.router);
      console.info(`init route: ${controller.path}`);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info('listening on port ' + this.port);
    });
  }
}
