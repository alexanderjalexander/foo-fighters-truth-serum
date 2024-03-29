import "dotenv/config";
import { expect, test, afterAll, beforeAll, beforeEach } from '@jest/globals';
import { closeConnection, detections, users } from '../config/mongo.js';
import { ObjectId } from "mongodb";
import { createDetection, deleteDetection, flagDetection, renameDetection } from "../data/detections.js";
import { getUserById } from "../data/users.js";
import { StatusError } from "../validation.js";

const _id = new ObjectId("000000646574656374696F6E");

beforeAll(async () => {
  const usersCol = await users();
  usersCol.insertOne({
    _id,
    email: "detections@truth.com",
    hash: "",
    people: [
      {
        _id,
        name: "Liar",
        detections: [ _id ]
      }
    ]
  });
});

beforeEach(async () => {
  const detectionsCol = await detections();
  await detectionsCol.deleteOne({ _id });
  await detectionsCol.insertOne({
    _id,
    name: "Sample detection"
  });
});

afterAll(async () => {
  await closeConnection();
});

test('createDetection: Cannot create detection on invalid user', async () => {
  await expect(createDetection(
    "100000000000000000000000",
    "100000000000000000000000",
    "Session 1",
    "dummy data"
  )).rejects.toEqual(
    new StatusError(404, "User does not exist.")
  );
  await expect(createDetection(
    _id,
    "100000000000000000000000",
    "Session 1",
    "dummy data"
  )).rejects.toEqual(
    new StatusError(404, "Person does not exist.")
  );
});

test('createDetection: Cannot create detection with invalid name', async () => {
  await expect(createDetection(
    _id,
    _id,
    "                ",
    "dummy data"
  )).rejects.toEqual(
    new StatusError(400, "Detection name must be a non-empty string.")
  );
});

test('createDetection: Can create detection with valid inputs', async () => {
  const createPromise = createDetection(
    _id,
    _id,
    "Session 1",
    "dummy data"
  );
  await expect(createPromise).resolves.toMatchObject({
    name: "Session 1",
    data: "dummy data"
  });
  const newId = (await createPromise)._id;
  await expect(getUserById(_id)).resolves.toMatchObject({
    people: [
      {
        _id,
        detections: [ _id, newId ]
      }
    ]
  })
});

test('renameDetection: Cannot rename non-existant detection', async () => {
  await expect(renameDetection(
    "100000000000000000000000",
    "Session 13892"
  )).rejects.toEqual(
    new StatusError(404, "Detection does not exist.")
  );
});

test('renameDetection: Cannot rename detection to invalid name', async () => {
  await expect(renameDetection(_id, "                   ")).rejects.toEqual(
    new StatusError(400, "Detection name must be a non-empty string.")
  );
});

test('renameDetection: Can rename detection to valid name', async () => {
  await expect(renameDetection(_id, "Session 1234")).resolves.toMatchObject(
    {
      _id,
      name: 'Session 1234'
    }
  );
});

test('deleteDetection: Cannot delete non-existant detection', async () => {
  await expect(deleteDetection("100000000000000000000000")).rejects.toEqual(
    new StatusError(404, "Detection does not exist.")
  );
});

test('deleteDetection: Can delete existing detection', async () => {
  await expect(deleteDetection(_id)).resolves.toBeUndefined();
});

test('flagDetection: Cannot flag non-existant detection', async () => {
  await expect(flagDetection(
    "100000000000000000000000"
  )).rejects.toEqual(
    new StatusError(404, "Detection does not exist.")
  );
});

test('flagDetection: Can flag detection', async () => {
  await expect(flagDetection(_id)).resolves.toMatchObject(
    {
      _id,
      flagged: true
    }
  );
});
