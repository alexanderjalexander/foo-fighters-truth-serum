import "dotenv/config";
import { closeConnection } from "../config/mongo.js";
import { closeServer } from "../app.js";

export default async function (globalConfig, projectConfig) {
  await closeConnection();
  await closeServer();
};
