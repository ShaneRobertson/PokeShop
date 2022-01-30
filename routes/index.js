require("dotenv").config();
const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { getUser } = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({ message: "hello" });
  console.log("💡💡💡💡💡💡");
});

apiRouter.post("/login", async (req, res, next) => {
  const { username, userPassword } = req.body;

  try {
    const loggedInUser = await getUser(username);
    if (loggedInUser.length > 0) {
      const [{ password: dbPassword }] = loggedInUser;
      if (dbPassword == userPassword) {
        console.log("Matched!");
        //maybe loop over the loggedInUser and take out the password
        jwt.sign({ loggedInUser }, process.env.jwtSecret, (err, token) => {
          console.log("err is:", err);
          if (err) {
            res.send({ error: err, status: 403 });
          } else {
            res.json({ loggedInUser, token });
          }
        });
      } else {
        res.send({ message: "Username or password do not match." });
      }
    } else {
      res.send({ message: "Username or password do not match." });
    }
  } catch (err) {
    console.log("error in routes: ", err);
  }
});
module.exports = apiRouter;
