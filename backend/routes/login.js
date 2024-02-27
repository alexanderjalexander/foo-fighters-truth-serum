const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  //but actually serve a login page.
  console.log("went to login");
  res.json({ test: "success" });
});

module.exports = router;
