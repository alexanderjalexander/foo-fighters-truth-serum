import "dotenv/config";
import { expect, test } from "@jest/globals";

const makeRequest = async (route, method = 'GET', body) => {
  return await fetch(`http://localhost:4000/api${route}`, {
    method,
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });
};

const reqWithCreds = async (route, email, password) =>
  await makeRequest(route, "POST", JSON.stringify({ email, password }));

test("/api/register with invalid credentials", async () => {
  const res = await reqWithCreds(
    "/register",
    "bad@email",
    "bad password"
  );
  expect(res.status).toBe(400);
});

test("/api/register with valid credentials", async () => {
  const res = await reqWithCreds(
    "/register",
    "auth@example.com",
    "Str0ngS3cur!ty"
  );
  expect(res.status).toBe(200);
});

test("/api/login with invalid credentials", async () => {
  const res = await reqWithCreds(
    "/login",
    "auth@example.com",
    "wrong password"
  );
  expect(res.status).toBe(401);
});

test("/api/login with valid credentials", async () => {
  const res = await reqWithCreds(
    "/login",
    "auth@example.com",
    "Str0ngS3cur!ty"
  );
  expect(res.status).toBe(200);
});

test("/api/me when logged in", async () => {
  const res = await makeRequest("/me");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json.username).toBe("auth@example.com");
});