import { Router } from "express";
import { verifyUser } from "../data/users.js";

const router = Router();

//for logging in
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    await verifyUser(email, password);
    res.status(200).json({ message: "Succesfully logged in" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
