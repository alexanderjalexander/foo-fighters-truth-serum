import registrationRoute from "./registration.js";
import loginRoute from "./login.js";
//import privateRoute from "./private.js";
import logoutRoute from "./logout.js";
import addNewPersonRoute from "./addNewPerson.js";

const constructorMethod = (app) => {
  app.use("/api/login", loginRoute);
  app.use("/api/registration", registrationRoute);
  app.use("/api/logout", logoutRoute);
  app.use("/api/addNewPerson", addNewPersonRoute);
};

export default constructorMethod;
