import { Router } from "express";
import { checkAuth, sync } from "./middleware.js";
import { createSession, renameSession } from "../data/sessions.js";

const router = Router();

router.post('/', checkAuth, sync(async (req, res) => {
  const person = await createSession(
    req.session.user._id,
    req.params.personId,
    req.body.name
  );
  res.status(200).json(person);
}));

router.post('/:sessionId', checkAuth, sync(async (req, res) => {
  const session = await renameSession(
    req.session.user._id,
    req.params.personId,
    req.params.sessionId,
    req.body.name
  );
  res.status(200).json(session);
}));

export default router;
