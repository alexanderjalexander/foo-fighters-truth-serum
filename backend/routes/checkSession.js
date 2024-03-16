import { Router } from "express";
import session from "express-session";

const router = Router();
// for the front end to call as needed to see if user has already logged in and session is active
// checks the session store for if the user has already logged in
    // the userId property gets set when a user successfully logs in
router.get("/", async (req, res) => {
  if(req.session.userId){
    res.status(200).json({ message: "session active" });
  }else{
    res.status(401).json({ error: "No session active" });
  }
});
export default router;