import App from "./app";
import StorageController from "./controllers/storageController";

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

app.listen();
