import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import session from "express-session";
import configRoutes from "./routes/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: "goodName",
    secret: "NJTransitFareHikeComingJuly",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 },
  })
);

//prevent from advancing to logged-in utility when not in session.
app.use("/private", (req, res, next) => {
  console.log(req.session.id);
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

//prevent login if session active. not needed for /registration
app.use("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    req.method = "POST";
    next();
  }
});

configRoutes(app);

//console.log(__dirname);

// All client pages
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "/../frontend/build/index.html"));
});

let server = app.listen(4000, () => {
  console.log(`App started at http://localhost:4000`);
});


const closeServer = async () => {
  await server.close();
}

export { app, closeServer };
