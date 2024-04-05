import "dotenv/config";
import { expect, test, beforeEach, afterAll } from '@jest/globals';
import { closeConnection, sessions, users } from '../config/mongo.js';
import { ObjectId } from "mongodb";
import { createSession, getSessionById, renameSession } from "../data/sessions.js";
import { StatusError } from "../validation.js";
import { createDetection, getDetection, moveToSession } from "../data/detections.js";

const userId = new ObjectId("000000000000000010000000");
const personId = new ObjectId("000000000000000100000000");
const sessionId = new ObjectId("000000000000001000000000")

beforeEach(async () => {
  const usersCol = await users();
  await usersCol.deleteOne({ _id: userId });
  await usersCol.insertOne({
    _id: userId,
    email: "people@example.com",
    hash: "",
    people: [
      {
        _id: personId,
        name: "Dummy",
        detections: [],
        sessions: [sessionId]
      }
    ]
  });
  const sessionsCol = await sessions();
  await sessionsCol.deleteOne({ _id: sessionId });
  await sessionsCol.insertOne({
    _id: sessionId,
    name: "Test Session"
  });
})


afterAll(async () => {
  await closeConnection();
});

test('getSessionById: Get non-existant session', async () => {
  await expect(getSessionById(
    userId,
    personId,
    new ObjectId("111111111111111111111111")
  )).resolves.toBe(null);
});

test('getSessionById: Get existing session on wrong person', async () => {
  await expect(getSessionById(
    userId,
    new ObjectId("111111111111111111111111"),
    new ObjectId("111111111111111111111111")
  )).rejects.toEqual(new StatusError(
    404,
    "Person does not exist."
  ));
});

test('createSession: Create a session on a valid person', async () => {
  const person = await createSession(userId, personId, "Test Session 2");
  expect(person.sessions).toHaveLength(2);
});

test('renameSession: Rename existing session', async () => {
  await expect(renameSession(
    userId,
    personId,
    sessionId,
    "Renamed Session"
  )).resolves.toMatchObject({
    name: "Renamed Session"
  });
});

test('moveToSession: Move existing detection from session', async () => {
  const detection = await createDetection(
    userId,
    personId,
    sessionId,
    "Test Detection",
    null,
    false,
    0
  );
  await moveToSession(
    userId,
    detection._id,
    null
  );
  const detectionAgain = await getDetection(detection._id);
  expect(detectionAgain.sessionId).toBe(null);
});

test('moveToSession: Move existing detection to session', async () => {
  const detection = await createDetection(
    userId,
    personId,
    null,
    "Test Detection",
    null,
    false,
    0
  );
  await moveToSession(
    userId,
    detection._id,
    sessionId
  );
  const detectionAgain = await getDetection(detection._id);
  expect(detectionAgain.sessionId).toEqual(sessionId);
});
