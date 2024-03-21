import { Router } from "express";
import { sync } from "../validation.js";
import { createPerson, getAllDetections } from "../data/people.js";
import { getUserById } from "../data/users.js";

const router = Router();

router.post('/', sync(async (req, res) => {
  const person = await createPerson(req.session.user._id, req.body.personName);
  res.status(200).json(person);
}));

router.get('/', sync(async (req, res) => {
  const user = await getUserById(req.session.user._id);
  if (!user) throw new Error("Session user missing.");
  user.people.forEach(person => person.numDetections = person.detections.length);
  res.status(200).json(user.people);
}));

router.get('/:personId/detections', sync(async(req, res) => {
  const detections = await getAllDetections(req.session.user._id, req.params.personId);
  res.status(200).json(detections);
}));

export default router;
