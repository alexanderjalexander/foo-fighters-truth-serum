import "dotenv/config";
import { MongoClient } from "mongodb";

/** @type {import("mongodb").MongoClient} */
export let _conn;
/** @type {import("mongodb").Db} */
let _db;

/**
 * Gets the database connection object, or makes one if needed.
 * @returns {Promise<import("mongodb").Db>}
 */
export const dbConnection = async () => {
  if (!_conn) {
    _conn = await MongoClient.connect(process.env.CONNECTION_URI);
    _db = _conn.db(process.env.DATABASE);
  }

  return _db;
};

/**
 * Closes the database connection.
 */
export const closeConnection = async () => {
  if (_conn)
    await _conn.close(true);
  _conn = null;
  _db = null;
};

/**
 * Memoizes collection accesses.
 * @returns {()=>Promise<import("mongodb").Collection>}
 */
const memoCollection = (collection) => {
  let _col;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = db.collection(collection);
    }

    return _col;
  };
};

export const users = memoCollection('users');
export const detections = memoCollection('detections');
export const sessions = memoCollection('sessions');
