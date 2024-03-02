import "dotenv/config";

export default async function (globalConfig, projectConfig) {
  process.env.DATABASE = 'TEST_' + process.env.DATABASE;
};
