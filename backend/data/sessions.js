import { ObjectId } from "mongodb";
import { sessions, users } from "../config/mongo.js";
import { StatusError, requireId, requireString } from "../validation.js";
import { getPersonById } from "./people.js";

/**
 * @typedef Session
 * @property {ObjectId} _id The ObjectID for this Detection
 * @property {string} name The name of this Session
 */

/**
 * Get a Session by its ID.
 * @param {ObjectId} userId The User ID
 * @param {ObjectId} personId The Person ID with the Session
 * @param {ObjectId} sessionId The Session ID
 * @returns {Promise<Session>}
 */
export const getSessionById = async (userId, personId, sessionId) => {
  userId = requireId(userId, "User ID");
  personId = requireId(personId, "Person ID");
  sessionId = requireId(sessionId, "Session ID");

  const person = await getPersonById(userId, personId);
  if (!person) throw new StatusError(404, "Person does not exist.");
  if (!person.sessions.find(id => sessionId.equals(id)))
    return null;

  const sessionsCol = await sessions();
  const session = await sessionsCol.findOne({ _id: sessionId });
  return session;
}

/**
 * Create a new Session on a Person.
 * @param {ObjectId} userId User that has Person
 * @param {ObjectId} personId Person to add Session to
 * @param {string} name Name of the Session to create
 * @returns {Promise<import("./people.js").Person>} The update Person
 */
export const createSession = async (userId, personId, name) => {
  userId = requireId(userId, "User ID");
  personId = requireId(personId, "Person ID");
  name = requireString(name, "Name");

  const session = {
    _id: new ObjectId(),
    name
  };

  const sessionsCol = await sessions();
  const res = await sessionsCol.insertOne(session);
  if (!res.acknowledged)
    throw new Error("Failed to create new session.");

  const usersCol = await users();
  const res2 = await usersCol.updateOne(
    {
      _id: userId,
      people: {
        $elemMatch: {
          _id: personId
        }
      }
    },
    {
      $push: {
        "people.$.sessions": session._id
      }
    }
  );
  if (!res2.acknowledged)
    throw new Error("Failed to add new session to person.");

  return await getPersonById(userId, personId);
};

/**
 * Rename a Session on a specific Person.
 * @param {ObjectId} userId The User ID
 * @param {ObjectId} personId The Person ID with the Session
 * @param {ObjectId} sessionId The Session ID
 * @param {string} newName The new name for the Session
 */
export const renameSession = async (userId, personId, sessionId, newName) => {
  userId = requireId(userId, "User ID");
  personId = requireId(personId, "Person ID");
  sessionId = requireId(sessionId, "Session ID");
  newName = requireString(newName, "Name");
  
  if (!(await getSessionById(userId, personId, sessionId)))
    throw new StatusError(404, "Session does not exist.");

  const sessionsCol = await sessions();
  const res = await sessionsCol.updateOne(
    { _id: sessionId },
    { $set: { name: newName } }
  );
  if (!res.acknowledged)
    throw new Error("Failed to update session name.");

  return await getSessionById(userId, personId, sessionId);
};
