import "dotenv/config";
import { closeConnection } from "../config/mongo.js";

export default async function (globalConfig, projectConfig) {
  await closeConnection();
};
