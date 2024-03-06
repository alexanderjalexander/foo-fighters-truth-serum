import "dotenv/config";
import { expect, test } from "@jest/globals";
import { closeServer } from "../app.js";

const makeRequest = async (route, email, password) => {
  return await fetch(`http://localhost:4000/api${route}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
};

test("/api/registration with invalid credentials", async () => {
  const res = await makeRequest(
    "/registration",
    "bad@email",
    "bad password"
  );
  expect(res.status).toBe(400);
});

test("/api/registration with valid credentials", async () => {
  const res = await makeRequest(
    "/registration",
    "auth@example.com",
    "Str0ngS3cur!ty"
  );
  expect(res.status).toBe(200);
});

test("/api/login with invalid credentials", async () => {
  const res = await makeRequest(
    "/login",
    "auth@example.com",
    "wrong password"
  );
  expect(res.status).toBe(400);
});

test("/api/login with valid credentials", async () => {
  const res = await makeRequest(
    "/login",
    "auth@example.com",
    "Str0ngS3cur!ty"
  );
  expect(res.status).toBe(200);
});

afterAll(async () => {
  await closeServer();
});
