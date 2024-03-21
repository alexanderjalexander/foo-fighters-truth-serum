import { Router } from "express";
import session from "express-session";
import { createPerson } from "../data/people.js";

const router = Router()

router.post("/", async (req, res) => {
  if (!req.session) {
    res.status(400).json({ error: "No active session detected" });
  }

  const personName = req.body.personName;
  const userId = req.session.userId;

  await createPerson(userId, personName)
    .then((person) => {
      res.status(201).json({ message: `Successfully added person ${person.name}` });
    })
    .catch((err) => {
      if (err.message == "User does not exist.") {
        res.status(500);
      } else if (err.message == "A person with that name exists already.") {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Failed to add person to user.' });
      }
    });
  });

export default router;