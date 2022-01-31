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
        const [theUser] = loggedInUser;
        let returnedUser = {};
        for (const key in theUser) {
          if (key != "password") {
            returnedUser[key] = theUser[key];
          }
        }
        jwt.sign({ loggedInUser }, process.env.jwtSecret, (err, token) => {
          if (err) {
            res.send({ error: err, status: 403 });
          } else {
            res.json({ loggedInUser, token });
          }
        });
      } else {
        res.send({ message: "Username or password invalid. Try again." });
      }
    } else {
      res.send({ message: "Username or password invalid. Try again." });
    }
  } catch (err) {
    console.log("error in routes: ", err);
  }
});
module.exports = apiRouter;
