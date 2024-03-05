import registrationRoute from "./registration.js";
import loginRoute from "./login.js";
import privateRoute from "./private.js";

const constructorMethod = (app) => {
  app.use("/api/login", loginRoute);
  app.use("/api/registration", registrationRoute);
  app.use("/api/private", privateRoute);
};

export default constructorMethod;
