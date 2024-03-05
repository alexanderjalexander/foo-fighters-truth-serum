import "dotenv/config";
import { dbConnection, users } from "../config/mongo.js";

export default async function (globalConfig, projectConfig) {
  process.env.DATABASE = 'TEST_' + process.env.DATABASE;
  await (await dbConnection()).dropDatabase();
};
