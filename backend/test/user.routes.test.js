import "dotenv/config";
import { expect, test } from "@jest/globals";
import {closeServer} from "../app.js";

test("landing api point", async () => {
  await expect(await (await fetch("http://localhost:4000/")).text()).toContain(
    "EEG"
  );
});

test("* wildcard serves client", async () => {
  await expect(
    await (await fetch("http://localhost:4000/taco")).text()
  ).toContain("EEG");
  await expect(await (await fetch("http://localhost:4000//")).text()).toContain(
    "EEG"
  );
});

test("registration with invalid credentials", async () => {
  await expect(async () => {
    let res1 = await fetch("http://localhost:4000/api/registration", {
      method: "POST",
      body: {
        email: "bademail",
        password: "basspadword",
      },
    });
    expect(res1.status).toBe(400);
  });
});

test("registration with valid credentials", async () => {
  await expect(async () => {
    let res2 = await fetch("http://localhost:4000/api/registration", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "Str0ngS3cur!ty",
      },
    });
    expect(res2.status).toBe(200);
  });
});

test("login with invalid credentials", async () => {
  await expect(async () => {
    let res3 = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "wrong",
      },
    });
    expect(res3.status).toBe(400);
  });
});

test("login with valid credentials", async () => {
  await expect(async () => {
    let res4 = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "Str0ngS3cur!ty",
      },
    });
    expect(res4.status).toBe(200);
  });
});

afterAll(async () => {
  await closeServer();
});
