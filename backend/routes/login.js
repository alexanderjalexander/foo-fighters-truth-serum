import { Router } from "express";

const router = Router();

//for logging in
router.post("/", (req, res) => {
  console.log("went to login");
  const { username, password } = req.body;
  //things with mongodb to be done

  // if(authenticationFunction){
  //   req.session.user = { UID }; //altered with db stuff
  //   res.status(200).send("successfully logged in")
  // }
  // else{
  //   res.status(400).send("incorrect credentials")
  // }
});

export default router;
