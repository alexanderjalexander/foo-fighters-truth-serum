import "dotenv/config";
import { expect, test } from '@jest/globals';
import { createUser, verifyUser } from "../data/users.js";
import { closeConnection, users } from '../config/mongo.js';

beforeEach(async () => {
  (await users()).deleteMany({});
})

afterAll(async () => {
  await closeConnection();
});

test('createUser: Cannot create user with invalid email', async () => {
  await expect(createUser(
    "ThisIsNot@A@ValidEmail.com",
    "Str0ngS3cur!ty"
  )).rejects.toEqual(
    new Error("Provided email address isn't valid.")
  );
  await expect(createUser(
    "Missing@TLD",
    "Str0ngS3cur!ty"
  )).rejects.toEqual(
    new Error("Provided email address isn't valid.")
  );
  await expect(createUser(
    "@NoUser.com",
    "Str0ngS3cur!ty"
  )).rejects.toEqual(
    new Error("Provided email address isn't valid.")
  );
});

test('createUser: Cannot create user with invalid password', async () => {
  await expect(createUser(
    "user@example.com",
    "Str0ng"
  )).rejects.toEqual(
    new Error("Password must be at least 10 characters long.")
  );
  await expect(createUser(
    "user@example.com",
    "str0ngs3cur!ty"
  )).rejects.toEqual(
    new Error("Password must have at least 1 upper case letter.")
  );
  await expect(createUser(
    "user@example.com",
    "STR0NGS3CUR!TY"
  )).rejects.toEqual(
    new Error("Password must have at least 1 lower case letter.")
  );
  await expect(createUser(
    "user@example.com",
    "StrongSecur!ty"
  )).rejects.toEqual(
    new Error("Password must have at least 1 number.")
  );
  await expect(createUser(
    "user@example.com",
    "Str0ngS3curity"
  )).rejects.toEqual(
    new Error("Password must have at least 1 non alphanumeric character.")
  );
});

test('createUser: Can create user with valid credentials', async () => {
  await expect(createUser(
    "user@example.com",
    "Str0ngS3cur!ty"
  )).resolves.toMatchObject({
    email: "user@example.com",
    people: []
  });
  // Check DB
  const usersCol = await users();
  const user = await usersCol.findOne({ email: "user@example.com" });
  expect(user).toMatchObject({
    email: "user@example.com",
    people: []
  });
});

test('createUser: Cannot create 2 users with the same email', async () => {
  await expect(createUser(
    "user@example.com",
    "Str0ngS3cur!ty"
  )).resolves.toMatchObject({
    email: "user@example.com",
    people: []
  });
  await expect(createUser(
    "user@example.com",
    "Str0ngS3cur!ty"
  )).rejects.toEqual(
    new Error("Email is already used by another account.")
  );
  // Check DB
  const usersCol = await users();
  const matches = usersCol.find({ email: "user@example.com" });
  expect((await matches.toArray()).length).toBe(1);
});

test('verifyUser: Correct credentials return user', async () => {
  await createUser("user@example.com", "Str0ngS3cur!ty");
  await expect(verifyUser(
    "user@example.com",
    "Str0ngS3cur!ty"
  )).resolves.toMatchObject({
    email: "user@example.com",
    people: []
  });
});

test('verifyUser: Incorrect credentials return null', async () => {
  await createUser("user@example.com", "Str0ngS3cur!ty");
  await expect(verifyUser(
    "user@example.com",
    "WrongPassword"
  )).resolves.toEqual(null);
});
