import { getDetection } from "../data/detections.js";

export const sync = f => (req, res, next) => f(req, res, next).catch(next);

export const checkAuth = sync(async (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ error: 'Not logged in.' })
  const { detectionId } = req.params;
  if (detectionId) {
    const detection = await getDetection(detectionId);
    if (detection.owner.toString() !== req.session.user._id)
      return res.status(404).json({ error: 'Detection not found.' });
  }
  next();
});
