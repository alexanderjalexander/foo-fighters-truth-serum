import "dotenv/config";
import { expect, test } from "@jest/globals";
import app from "../app.js";

// beforeAll(() => {
//   app.listen(3000);
// });

test("landing api point", async () => {
  await expect(await (await fetch("http://localhost:3000/")).text()).toContain(
    "Foo Fighters"
  );
});

test("* wildcard serves client", async () => {
  await expect(
    await (await fetch("http://localhost:3000/taco")).text()
  ).toContain("Foo Fighters");
  await expect(await (await fetch("http://localhost:3000//")).text()).toContain(
    "Foo Fighters"
  );
});
