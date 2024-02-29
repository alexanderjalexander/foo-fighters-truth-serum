import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (/^[a-zA-Z0-9_-]+$/.test(username) == false) {
    res.status(400).send("username must not have spaces and stay alphanumeric");
  } else if (username.length < 8) {
    res.status(400).send("username must be longer than 8 characters");
  } else if (
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    ) == false
  ) {
    res
      .status(400)
      .send(
        "password must contain only uppercase letters, lowercase letters, digits, and special chatacters with a length greater than 8 characters"
      );
  } else if (password.length < 8) {
    res.status(400).send("password must be longer than 8 characters");
  } else {
    //database stuff
    res.status(200).send("successfully registered.");
  }
});

export default router;
