import { Router } from "express";

const router = Router();

//for logging out
router.post("/", async (req, res) => {
  if(req.session.userId) {
    req.session.destroy( (err) => {
      if(err) {
        res.status(500);
      } else {
        res.status(200).json({ message: "Successfully logged out" });
      }
    }
    );
  } else {
    res.status(401).json({ error: "No active session detected" });
  }
});

export default router;
