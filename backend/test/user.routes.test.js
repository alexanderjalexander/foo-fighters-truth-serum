import "dotenv/config";
import { expect, test } from "@jest/globals";
import app from "../app.js";
import configRoutes from "../routes/index.js";

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

afterAll(app.close());
