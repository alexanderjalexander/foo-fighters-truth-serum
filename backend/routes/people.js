import { Router } from "express";
import { createPerson, getAllDetections, getAllSessions, getPersonById, renamePerson } from "../data/people.js";
import { getUserById } from "../data/users.js";
import { checkAuth, sync } from "./middleware.js";
import multer from "multer";
import { createDetection, runDetection } from "../data/detections.js";
import sessionsRouter from "./sessions.js";
import { StatusError } from "../validation.js";

const router = Router();

router.post('/', checkAuth, sync(async (req, res) => {
  const person = await createPerson(req.session.user._id, req.body.personName);
  res.status(200).json(person);
}));

router.get('/', checkAuth, sync(async (req, res) => {
  const user = await getUserById(req.session.user._id);
  if (!user) throw new Error("Session user missing.");
  user.people.forEach(person => person.numDetections = person.detections.length);
  res.status(200).json(user.people);
}));

router.get('/:personId', checkAuth, sync(async (req, res) => {
  const person = await getPersonById(req.session.user._id, req.params.personId);
  if (!person) throw new StatusError(404, 'Person not found.');
  const detections = await getAllDetections(req.session.user._id, req.params.personId);
  const sessions = await getAllSessions(req.session.user._id, req.params.personId);
  const binned = detections.reduce((bins, detection) => {
    const sessionName = sessions.find(({ _id }) => _id.equals(detection.sessionId))?.name || 'Not In A Session';
    if (!bins[sessionName]) bins[sessionName] = [detection];
    else bins[sessionName].push(detection);
    return bins;
  }, {});
  res.status(200).json({
    name: person.name,
    detections: binned,
    sessions
  })
}));

router.get('/:personId/detections', checkAuth, sync(async(req, res) => {
  const detections = await getAllDetections(req.session.user._id, req.params.personId);
  res.status(200).json(detections);
}));

router.post('/:personId/detections', multer().single('file'), checkAuth, sync(async(req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Must provide a file." });
  const now = new Date();
  const detectionName = req.body.name || `New Detection (${now.toDateString()} ${now.toTimeString()})`;
  const sessionId = req.body.sessionId;
  const [truth, confidence] = await runDetection(file.buffer);
  await createDetection(
    req.session.user._id,
    req.params.personId,
    sessionId,
    detectionName,
    file.buffer,
    truth,
    confidence
  );
  res.status(200).json();
}));

router.patch('/:personId', checkAuth, sync(async(req, res) => {
  const user = await renamePerson(req.session.user._id, req.params.personId, req.body.name);
  res.status(200).json(user);
}));

router.use('/:personId/sessions/', sessionsRouter);

export default router;
