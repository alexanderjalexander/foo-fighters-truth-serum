import "dotenv/config";
import { expect, test } from "@jest/globals";
import supertest from "supertest";
import { server, closeServer } from "../app";
import { createDetection } from "../data/detections";
import { users } from "../config/mongo";

const agent = supertest.agent(server);

afterAll(async () => await closeServer());

const reqWithCreds = async (route, email, password) =>
  await agent.post(`/api${route}`)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({ email, password }));

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
    "Str0ngS3cur!ty",
  );
  expect(res.status).toBe(200);
});

test("/api/login with invalid credentials", async () => {
  const res = await reqWithCreds(
    "/login",
    "auth@example.com",
    "wrong password",
  );
  expect(res.status).toBe(401);
});

test("/api/login with valid credentials", async () => {
  const res = await reqWithCreds(
    "/login",
    "auth@example.com",
    "Str0ngS3cur!ty",
  );
  expect(res.status).toBe(200);
});

test("/api/me when logged in", async () => {
  const res = await agent.get("/api/me");
  expect(res.status).toBe(200);
  expect(res.body.username).toBe("auth@example.com");
});

test("/api/me when logged out", async () => {
  await agent.post("/api/logout");
  const res = await agent.get("/api/me");
  expect(res.status).toBe(401);
});

test("POST /api/people with invalid name", async () => {
  expect((await reqWithCreds(
    "/login",
    "auth@example.com",
    "Str0ngS3cur!ty",
  )).status).toBe(200);
  await agent.post("/api/people")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({
      personName: '    hi    '
    }))
    .expect(400);
});

test("POST /api/people with valid name", async () => {
  await agent.post("/api/people")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({
      personName: 'New Guy'
    }))
    .expect(200);
});

let guyId;

test("GET /api/people", async () => {
  const res = await agent.get("/api/people")
    .expect(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe("New Guy");
  guyId = res.body[0]._id;
});

test("GET /api/people/:personId/detections", async () => {
  const res = await agent.get(`/api/people/${guyId}/detections`)
    .expect(200);
  expect(res.body.length).toBe(0);
});

let detectionId;

test("POST /api/detections/:detectionId/name", async () => {
  const user = await (await users()).findOne({ email: "auth@example.com" });
  const detection = await createDetection(user._id, guyId, null, "Flagged Sample", "", true);
  detectionId = detection._id.toString();
  await agent.post(`/api/detections/${detectionId}/name`)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({
      name: 'Flagged Sample Renamed'
    }))
    .expect(200);
});

test("POST /api/detections/:detectionId/flag", async () => {
  await agent.post(`/api/detections/${detectionId}/flag`)
    .expect(200);
});

test("POST /api/detections/:detectionId/flag", async () => {
  await agent.post(`/api/detections/${detectionId}/comment`)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({
      comment: 'This is a sample comment.'
    }))
    .expect(200);
});
