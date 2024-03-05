import "dotenv/config";
import { expect, test } from '@jest/globals';
import { closeConnection, users } from '../config/mongo.js';
import { ObjectId } from "mongodb";
import { createPerson } from "../data/people.js";
import { getUserById } from "../data/users.js";

beforeEach(async () => {
  const usersCol = await users();
  const _id = new ObjectId("000000000000000000000000");
  await usersCol.deleteOne({ _id });
  await usersCol.insertOne({
    _id,
    email: "people@example.com",
    hash: "",
    people: []
  });
})

afterAll(async () => {
  await closeConnection();
});

test('createPerson: Cannot create person on invalid user', async () => {
  await expect(createPerson(
    "000000000000000000000001",
    "Jack"
  )).rejects.toEqual(
    new Error("User does not exist.")
  );
  await expect(createPerson(
    "00000000000000000000",
    "Jill"
  )).rejects.toEqual(
    new Error("User ID must be a valid ID.")
  );
});

test('createPerson: Cannot create person with invalid name', async () => {
  await expect(createPerson(
    "000000000000000000000000",
    "Sh"
  )).rejects.toEqual(
    new Error("Person name must be at least 3 characters long.")
  );
  await expect(createPerson(
    "000000000000000000000000",
    "   Or   "
  )).rejects.toEqual(
    new Error("Person name must be at least 3 characters long.")
  );
});

test('createPerson: Can create person on valid user with valid name', async () => {
  await expect(createPerson(
    "000000000000000000000000",
    "   Jack"
  )).resolves.toMatchObject({
    name: "Jack",
    detections: []
  });
  await expect(createPerson(
    "000000000000000000000000",
    "Jill"
  )).resolves.toMatchObject({
    name: "Jill",
    detections: []
  });
  await expect(getUserById(
    new ObjectId("000000000000000000000000")
  )).resolves.toMatchObject({
    people: [
      {
        name: "Jack"
      },
      {
        name: "Jill"
      }
    ]
  });
});

test('createPerson: Cannot create two people with same name on same user.', async () => {
  await expect(createPerson(
    "000000000000000000000000",
    "   Jack"
  )).resolves.toMatchObject({
    name: "Jack",
    detections: []
  });
  await expect(createPerson(
    "000000000000000000000000",
    "Jack"
  )).rejects.toEqual(
    new Error("A person with that name exists already.")
  );
  const user = await getUserById(new ObjectId("000000000000000000000000"));
  expect(user.people.length).toEqual(1);
});

test('createPerson: Can create two people with same name on different users.', async () => {
  await expect(createPerson(
    "000000000000000000000000",
    "Jack"
  )).resolves.toMatchObject({
    name: "Jack",
    detections: []
  });
  const usersCol = await users();
  await usersCol.insertOne({
    _id: new ObjectId("000000000000000000000010"),
    email: "people2@example.com",
    hash: "",
    people: []
  });
  await expect(createPerson(
    "000000000000000000000010",
    "Jack"
  )).resolves.toMatchObject({
    name: "Jack",
    detections: []
  });
  const user = await getUserById(new ObjectId("000000000000000000000000"));
  expect(user.people.length).toEqual(1);
  const user2 = await getUserById(new ObjectId("000000000000000000000010"));
  expect(user2.people.length).toEqual(1);
});
