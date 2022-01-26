require("dotenv").config();
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

  // if (loggedInUser) {
  //   console.log("about to JWT this guy", loggedInUser);
  //   jwt.sign(loggedInUser, process.env.jwtSecret, (err, token) => {
  //     console.log("token is:", token);
  //     console.log(process.env.jwtSecret);
  //   });
  //   res.json(token);
  // }
  if (loggedInUser) {
    // encrypts user object, needs encrypting method
    // callback to handle error or send token in json
    jwt.sign({ loggedInUser }, process.env.jwtSecret, (err, token) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        res.json({ loggedInUser, token });
      }
    });
  } else {
    res.send({ message: "Username or password do not match." });
  }

  // console.log("result is: ", result);
  // res.json(result);
});
module.exports = apiRouter;
