import { meRoute, logoutRoute, loginRoute, registerRoute } from "./auth.js";
import peopleRoutes from "./people.js";
import detectionRoutes from "./detections.js";

const constructorMethod = (app) => {
  app.get("/api/me", meRoute);
  app.post("/api/login", loginRoute);
  app.post("/api/register", registerRoute);
  app.post("/api/logout", logoutRoute);
  app.use("/api/people", peopleRoutes);
  app.use("/api/detections", detectionRoutes);
};

export default constructorMethod;
