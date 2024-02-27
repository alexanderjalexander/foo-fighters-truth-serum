const express = require("express");
const app = express();
var path = require("path");

const loginRoute = require("./routes/login");

app.use("/login", loginRoute);

//landing page?
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../frontend/public/index.html"));
});

app.listen(3000, () => {
  console.log("backend/app.js running on port 3000");
});
