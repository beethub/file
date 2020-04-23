import express, { Express } from "express";
import { Server } from "http";
import { Controller } from "./controllers/controller";

class App {
  private _app: Express;
  private _port: number;

  constructor(port: number, controllers: Controller[]){
    this._app = express();
    this._port = port;
    this._initializeMiddlewares();
    this._initializeControllers(controllers);
  }

  private _initializeMiddlewares() {
  }
  private _initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }

  public get app() : Express {
    return this._app;
  }
  
  public listen() : Promise<Server> {
    return new Promise( (resolve) => {
      const server = this._app.listen(this._port, () => {
        console.log(`🚀 Server ready on the port ${this._port}`);
        resolve(server);
      });
    } )
  }

}

export default App;