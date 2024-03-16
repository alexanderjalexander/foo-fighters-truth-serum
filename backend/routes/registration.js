import { Router } from "express";
import { createUser } from "../data/users.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
    await createUser(email, password).then((user) => {
      res.status(201).json({ message: "Succesfully registered user" });
    }).catch((err) => {
      res.status(400).json({ error: err.message });
    });

});

export default router;
