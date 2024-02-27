import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  //but actually serve a login page.
  console.log("went to login");
  res.json({ test: "success" });
});

export default router;
