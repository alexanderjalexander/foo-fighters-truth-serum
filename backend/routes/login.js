import { Router } from "express";
import { verifyUser } from "../data/users.js";
import session from "express-session";

const router = Router();


router.post("/", async (req, res) => {
  const { email, password } = req.body;
  await verifyUser(email, password).then((user) => {
    if (user == null) {
      res.status(400).json({ message: "email or password incorrect" });
    } else if (typeof user == "object" && user != null) {
      req.session.user = email;
      req.session.userId = user._id;
      //req.session.userObj = user;
      console.log(req.session);
      res.status(200).json({ message: "Succesfully logged in" });
    } else {
      res.status(400).json({ message: "email or password incorrect" });
    }
  });
});

export default router;
