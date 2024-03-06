import { Router } from "express";

const router = Router();

//for logging in and out
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.send("Logged out. session ended.");
});

export default router;
