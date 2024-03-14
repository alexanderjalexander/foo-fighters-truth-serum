import registrationRoute from "./registration.js";
import loginRoute from "./login.js";
//import privateRoute from "./private.js";
import logoutRoute from "./logout.js";
import addNewPersonRoute from "./addNewPerson.js";
import getAllPeopleRoute from "./getAllPeople.js";
import getAllDetectionsRoute from "./getAllDetections.js";
import checkSessionRoute from "./checkSession.js";

const constructorMethod = (app) => {
  app.use("/api/login", loginRoute);
  app.use("/api/registration", registrationRoute);
  app.use("/api/logout", logoutRoute);
  app.use("/api/addNewPerson", addNewPersonRoute);
  app.use("/api/getAllPeople", getAllPeopleRoute);
  app.use("/api/getAllDetections", getAllDetectionsRoute);
  app.use("/api/checkSession", checkSessionRoute);
};

export default constructorMethod;
