import { meRoute, logoutRoute, loginRoute, registerRoute } from "./auth.js";
import peopleRoutes from "./people.js";

const constructorMethod = (app) => {
  app.get("/api/me", meRoute);
  app.post("/api/login", loginRoute);
  app.post("/api/register", registerRoute);
  app.post("/api/logout", logoutRoute);
  app.use("/api/people", peopleRoutes);
};

export default constructorMethod;
