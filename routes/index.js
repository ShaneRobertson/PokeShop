const apiRouter = require("express").Router();

apiRouter.get("/", (req, res, next) => {
  res.send({ message: "hello" });
  console.log("💡💡💡💡💡💡");
});

apiRouter.get("/hi", (req, res, next) => {
  res.send("hi");
});
module.exports = apiRouter;
