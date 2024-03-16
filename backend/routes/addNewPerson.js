import { Router } from "express";
import session from "express-session";
import { createPerson } from "../data/people.js";

const router = Router()

router.post("/", async (req, res) => {
  if(!req.session){
    res.status(400).json({ error: "No active session detected" });
  }
  const { personName } = req.body;
  let userId =  req.session.userId;
  try {
    await createPerson(userId, personName).then((person) => {
      res.status(200).json({ message: `Succesfully added person ${person.name}`});
    });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;