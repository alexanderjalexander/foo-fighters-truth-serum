import "dotenv/config";
import { dbConnection } from "../config/mongo.js";
import "../app.js";

export default async function (globalConfig, projectConfig) {
  process.env.DATABASE = 'TEST_' + process.env.DATABASE;
  await (await dbConnection()).dropDatabase();
};
