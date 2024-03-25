import { createUser, verifyUser } from "../data/users.js";
import { sync } from "./middleware.js";

export const meRoute = sync(async (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      username: req.session.user.email
    });
  } else {
    res.sendStatus(401);
  }
});

export const loginRoute = sync(async (req, res) => {
  // If there's a user on the session, someone is already logged in
  if (req.session.user)
    return res.status(400).json({ error: "Already logged in." });

  const user = await verifyUser(req.body.email, req.body.password);
  if (!user)
    return res.status(401).json({ error: "Incorrect username or password." });
  req.session.user = user;
  res.status(200).json({
    username: user.email
  });
});

export const registerRoute = sync(async (req, res) => {
  // If there's a user on the session, someone is already logged in
  if (req.session.user)
    return res.status(400).json({ error: "Already logged in." });

  await createUser(req.body.email, req.body.password);
  res.sendStatus(200);
});

export const logoutRoute = sync(async (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});
