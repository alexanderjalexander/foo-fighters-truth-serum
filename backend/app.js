import express from "express";
import { dirname, join } from "path";
import loginRoute from "./routes/login.js";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use("/login", loginRoute);

console.log(__dirname);

// All client pages
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "/../frontend/build/index.html"));
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
