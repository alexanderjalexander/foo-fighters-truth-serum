import { Router } from "express";
import { createUser } from "../data/users.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    await createUser(email, password);
    res.status(200).json({ message: "Succesfully registered user" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
