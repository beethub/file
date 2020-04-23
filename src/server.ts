import App from "./app";
import StorageController from "./controllers/storageController";
import { createLightship } from "lightship";

const getEnv = (input: string): string => {
  if (process.env[input]) {
    return process.env[input]!.toString();
  } else {
    throw new Error(`No environment define as ${input}`);
  }
};

const app = new App(4000, [
  new StorageController(
    getEnv("SPACES_KEY"),
    getEnv("SPACES_SECRET"),
    getEnv("BUCKET"),
    getEnv("NODE_ENV")
  ),
]);

const shutDownTime = 20 * 1000;
const lightship = createLightship({shutdownHandlerTimeout: shutDownTime});

app.listen().then(server =>{
  lightship.signalReady(); 
  lightship.registerShutdownHandler(async () => {
    await new Promise((resolve, reject) =>{
      setTimeout(() => {
       resolve 
      }, shutDownTime);
    });
    server.close();
  });  
});
