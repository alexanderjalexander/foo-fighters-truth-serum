import { Router } from "express";
import { verifyUser } from "../data/users.js";
import session from "express-session";

const router = Router();
// router.use(
//   session({
//     name: "goodName",
//     secret: "NJTransitFareHikeComingJuly",
//     saveUninitialized: false,
//     resave: false,
//     cookie: { maxAge: 1000 * 60 },
//   })
// );

//for logging in
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    await verifyUser(email, password).then((user) => {
      if (user == null) {
        res.status(400).json({ message: "email or password incorrect" });
      } else if (typeof user == "object" && user != null) {
        req.session.user = email;
        res.status(200).json({ message: "Succesfully logged in" });
      } else {
        res.status(400).json({ message: "email or password incorrect" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
