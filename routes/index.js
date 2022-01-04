const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");

apiRouter.get("/", (req, res, next) => {
  res.send({ message: "hello" });
  console.log("💡💡💡💡💡💡");
});

apiRouter.post("/login", (req, res, next) => {
  const { user, pass } = req.body;
  console.log("user in Routes: ", user, "pass in Routes: ", pass);
});
module.exports = apiRouter;
