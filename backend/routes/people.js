import { Router } from "express";
import { createPerson, getAllDetections } from "../data/people.js";
import { getUserById } from "../data/users.js";
import { checkAuth, sync } from "./middleware.js";
import multer from "multer";
import { createDetection } from "../data/detections.js";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const modelDir = join(dirname(fileURLToPath(import.meta.url)), '../../model');

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

router.get('/:personId/detections', checkAuth, sync(async(req, res) => {
  const detections = await getAllDetections(req.session.user._id, req.params.personId);
  res.status(200).json(detections);
}));

router.post('/:personId/detections', multer().single('file'), checkAuth, sync(async(req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Must provide a file." });
  const detectionName = req.body.name || `New Detection ${new Date().toString()}`;
  console.log(modelDir);
  try {
    const output = await new Promise((resolve, reject) => {
      const child = exec("python predict.py", {
        cwd: modelDir
      }, (err, stdout) => {
        if (err) reject(err);
        resolve(stdout.trim());
      });
      child.stdin.write(file.buffer);
    });
  
    await createDetection(req.session.user._id, req.params.personId, detectionName, file, output.endsWith("truth"));
    res.status(200).json();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to process data, please try again later." });
  }
}));

export default router;
