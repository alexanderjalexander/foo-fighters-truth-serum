import { Router } from "express";

const router = Router();

//for logging in and out
router.post("/", async (req, res) => {
  if(req.session) {
    req.session.destroy( (err) => {
      if(err) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(200).json({ message: "Successfully logged out" });
      }
    }
    );
  } else {
    res.status(400).json({ error: "No active session detected" });
  }
});

export default router;
