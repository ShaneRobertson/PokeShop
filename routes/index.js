require("dotenv").config();
const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { getUser } = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({ message: "hello" });
  console.log("💡💡💡💡💡💡");
});

// verify headers in token
// middleware for token verification
// move on to next() function
function verifyToken(req, res, next) {
  console.log("verify token function");
  //get Auth header
  const bearerToken = req.headers["authorization"].split(" ")[1];
  console.log("🔴", bearerToken);

  if (bearerToken == "null") {
    console.log("no token.....");
    res.sendStatus(403);
    next();
  } else {
    req.token = bearerToken;
    console.log("token is:", bearerToken);
    next();
  }
}

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
        jwt.sign({ returnedUser }, process.env.jwtSecret, (err, token) => {
          if (err) {
            res.send({ error: err, status: 403 });
          } else {
            res.json({ returnedUser, token });
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

apiRouter.post("/users", verifyToken, async (req, res, next) => {
  const {
    returnedUser: { username },
  } = jwt.verify(req.token, process.env.jwtSecret);
  const response = await getUser(username);

  console.log("response is: ", response);
});

module.exports = apiRouter;
