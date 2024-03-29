import { Router } from "express";
import { checkAuth, sync } from "./middleware.js";
import { flagDetection, renameDetection, updateDetectionComment } from "../data/detections.js";

const router = Router();

router.post('/:detectionId/name', checkAuth, sync(async (req, res) => {
  await renameDetection(req.params.detectionId, req.body.name);
  res.sendStatus(200);
}));

router.post('/:detectionId/flag', checkAuth, sync(async (req, res) => {
  await flagDetection(req.params.detectionId);
  res.sendStatus(200);
}));

router.post('/:detectionId/comment', checkAuth, sync(async (req, res) => {
  await updateDetectionComment(req.params.detectionId, req.body.comment);
  res.sendStatus(200);
}));

export default router;
