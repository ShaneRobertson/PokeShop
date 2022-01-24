const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { getUser } = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({ message: "hello" });
  console.log("💡💡💡💡💡💡");
});

apiRouter.post("/login", async (req, res, next) => {
  const { username, pass } = req.body;

  let userObj = { username, pass };
  const loggedInUser = await getUser(userObj);

  if (loggedInUser) {
    console.log("about to JWT this guy", loggedInUser);
  }
  console.log("result is: ", result);
  res.json(result);
});
module.exports = apiRouter;
