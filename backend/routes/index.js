import registrationRoute from "./registration.js";
import loginRoute from "./login.js";
import privateRoute from "./private.js";

const constructorMethod = (app) => {
  app.use("/login", loginRoute);
  app.use("/registration", registrationRoute);
  app.use("/private", privateRoute);
};

export default constructorMethod;
