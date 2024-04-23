import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import session from "express-session";
import configRoutes from "./routes/index.js";
import { closeConnection } from "./config/mongo.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();
app.use("/api/model", express.static('./model'));
app.use(express.static('./build'));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: "sessionCookie",
    secret: "NJTransitFareHikeComingJuly",
    saveUninitialized: false, 
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);
configRoutes(app);
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = (status !== 500 && err.message) || 'Internal Server Error';
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
});

// All client pages
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "./build/index.html"));
});

export const server = await new Promise(resolve => {
  const returnedServer = app.listen(4000, () => {
    if (process.env.NODE_ENV !== 'test')
      console.log(`App started at http://localhost:${returnedServer.address().port}`);
    resolve(returnedServer);
  });
});

export const closeServer = async () => {
  await new Promise((resolve, reject) => server.close((err) => {
    err ? reject(err) : resolve();
  }));
  await closeConnection();
};
